"use client";

import imageCompression from "browser-image-compression";
import { createClient } from "@/lib/supabase/client";
import type { Album, Photo } from "@/lib/types";
import { Check, Edit3, ImagePlus, Images, LayoutDashboard, Loader2, LogOut, Plus, Star, Trash2, UploadCloud, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ChangeEvent, DragEvent, FormEvent, useCallback, useEffect, useMemo, useState } from "react";

type Tab = "overview" | "photos" | "albums";
const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export function AdminDashboard() {
  const supabase = useMemo(() => createClient(), []);
  const [tab, setTab] = useState<Tab>("overview");
  const [albums, setAlbums] = useState<Album[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [queue, setQueue] = useState<File[]>([]);
  const [albumTitle, setAlbumTitle] = useState("");
  const [albumDescription, setAlbumDescription] = useState("");
  const [uploadAlbum, setUploadAlbum] = useState("");
  const [category, setCategory] = useState("Uncategorized");

  const load = useCallback(async () => {
    const [{ data: albumData }, { data: photoData }, { data: userData }] = await Promise.all([
      supabase.from("albums").select("*").order("created_at", { ascending: false }),
      supabase.from("photos").select("*").order("created_at", { ascending: false }),
      supabase.auth.getUser(),
    ]);
    if (!userData.user) { window.location.href = "/admin/login"; return; }
    const { data: admin } = await supabase.from("admins").select("user_id").eq("user_id", userData.user.id).maybeSingle();
    if (!admin) { setMessage("This account is authenticated but is not listed in the admins table."); setLoading(false); return; }
    setAlbums(albumData || []); setPhotos(photoData || []); setLoading(false);
  }, [supabase]);

  useEffect(() => { void load(); }, [load]);

  function addFiles(files: FileList | File[]) { setQueue((current) => [...current, ...Array.from(files).filter((file) => file.type.startsWith("image/"))]); }
  function onDrop(event: DragEvent<HTMLDivElement>) { event.preventDefault(); addFiles(event.dataTransfer.files); }

  async function createAlbum(event: FormEvent) {
    event.preventDefault(); setMessage("");
    const { error } = await supabase.from("albums").insert({ title: albumTitle, slug: slugify(albumTitle), description: albumDescription });
    if (error) setMessage(error.message); else { setAlbumTitle(""); setAlbumDescription(""); setMessage("Album created."); await load(); }
  }

  async function editAlbum(album: Album) {
    const title = window.prompt("Album title", album.title); if (!title) return;
    const description = window.prompt("Album description", album.description || "") ?? album.description;
    const { error } = await supabase.from("albums").update({ title, slug: slugify(title), description }).eq("id", album.id);
    setMessage(error?.message || "Album updated."); await load();
  }

  async function deleteAlbum(album: Album) {
    if (!window.confirm(`Delete “${album.title}”? Photos will remain in the main gallery.`)) return;
    const { error } = await supabase.from("albums").delete().eq("id", album.id); setMessage(error?.message || "Album deleted."); await load();
  }

  async function upload() {
    if (!queue.length) return; setUploading(true); setMessage("Optimizing images...");
    for (const original of queue) {
      try {
        const file = await imageCompression(original, { maxSizeMB: 1.8, maxWidthOrHeight: 2400, useWebWorker: true, fileType: "image/webp" });
        const path = `${new Date().getFullYear()}/${crypto.randomUUID()}.webp`;
        const { error: storageError } = await supabase.storage.from("portfolio-images").upload(path, file, { contentType: "image/webp", cacheControl: "31536000" });
        if (storageError) throw storageError;
        const { data: publicData } = supabase.storage.from("portfolio-images").getPublicUrl(path);
        const dimensions = await getDimensions(file);
        const title = original.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
        const { error: dbError } = await supabase.from("photos").insert({ album_id: uploadAlbum || null, title, alt_text: title, image_url: publicData.publicUrl, storage_path: path, category: category || "Uncategorized", width: dimensions.width, height: dimensions.height });
        if (dbError) { await supabase.storage.from("portfolio-images").remove([path]); throw dbError; }
        if (uploadAlbum && !albums.find((album) => album.id === uploadAlbum)?.cover_url) await supabase.from("albums").update({ cover_url: publicData.publicUrl }).eq("id", uploadAlbum);
      } catch (error) { setMessage(error instanceof Error ? error.message : "An upload failed."); setUploading(false); return; }
    }
    setQueue([]); setUploading(false); setMessage("Upload complete. Your gallery is live."); await load();
  }

  async function toggleFeatured(photo: Photo) { const { error } = await supabase.from("photos").update({ featured: !photo.featured }).eq("id", photo.id); setMessage(error?.message || (photo.featured ? "Removed from homepage." : "Added to homepage slideshow.")); await load(); }
  async function editPhoto(photo: Photo) { const title = window.prompt("Photo title", photo.title); if (!title) return; const alt = window.prompt("Accessible description", photo.alt_text) ?? photo.alt_text; const categoryValue = window.prompt("Category", photo.category) ?? photo.category; const { error } = await supabase.from("photos").update({ title, alt_text: alt, category: categoryValue }).eq("id", photo.id); setMessage(error?.message || "Photo updated."); await load(); }
  async function deletePhoto(photo: Photo) { if (!window.confirm(`Permanently delete “${photo.title}”?`)) return; if (photo.storage_path) await supabase.storage.from("portfolio-images").remove([photo.storage_path]); const { error } = await supabase.from("photos").delete().eq("id", photo.id); setMessage(error?.message || "Photo deleted."); await load(); }
  async function signOut() { await supabase.auth.signOut(); window.location.href = "/admin/login"; }

  if (loading) return <div className="flex min-h-screen items-center justify-center"><Loader2 className="animate-spin text-gold"/></div>;
  const navigation: [Tab, string, typeof LayoutDashboard][] = [["overview","Overview",LayoutDashboard],["photos","Photos",Images],["albums","Albums",ImagePlus]];
  const stats: [number, string, LucideIcon][] = [[photos.length,"Photographs",Images],[albums.length,"Albums",ImagePlus],[photos.filter((p)=>p.featured).length,"Featured",Star]];

  return <div className="min-h-screen bg-[#090909] lg:grid lg:grid-cols-[250px_1fr]">
    <aside className="border-b border-white/10 bg-[#0c0c0c] p-5 lg:min-h-screen lg:border-b-0 lg:border-r lg:p-7"><div className="font-display text-2xl tracking-[.15em]">RISHI<span className="text-gold">.</span></div><p className="mt-1 text-[9px] uppercase tracking-[.2em] text-white/30">Studio dashboard</p><nav className="mt-8 flex gap-2 overflow-x-auto lg:flex-col">{navigation.map(([value,label,Icon]) => <button key={value} onClick={() => setTab(value)} className={`flex min-w-max items-center gap-3 rounded-lg px-4 py-3 text-xs uppercase tracking-[.13em] transition ${tab === value ? "bg-gold text-ink" : "text-white/45 hover:bg-white/5 hover:text-white"}`}><Icon size={16}/>{label}</button>)}</nav><button onClick={signOut} className="mt-5 flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-[.13em] text-white/35 hover:text-white lg:absolute lg:bottom-7"><LogOut size={16}/>Sign out</button></aside>
    <div className="p-5 sm:p-8 lg:p-12"><header className="flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">Content manager</p><h1 className="mt-2 font-display text-5xl capitalize">{tab}</h1></div><a href="/" target="_blank" className="button-ghost">View live site</a></header>{message && <div className="mt-6 flex items-center justify-between rounded-xl border border-gold/20 bg-gold/10 px-4 py-3 text-sm text-gold"><span>{message}</span><button onClick={() => setMessage("")}><X size={16}/></button></div>}
      {tab === "overview" && <div className="mt-10"><div className="grid gap-4 sm:grid-cols-3">{stats.map(([value,label,Icon]) => <div key={label} className="glass rounded-2xl p-6"><Icon className="text-gold" size={20}/><p className="mt-8 font-display text-5xl">{value}</p><p className="mt-1 text-[10px] uppercase tracking-[.18em] text-white/35">{label}</p></div>)}</div><button onClick={() => setTab("photos")} className="mt-5 flex w-full items-center justify-center gap-3 rounded-2xl border border-dashed border-white/15 bg-white/[.025] py-16 text-sm text-white/45 transition hover:border-gold/50 hover:text-gold"><UploadCloud/>Upload new photographs</button></div>}
      {tab === "albums" && <div className="mt-10 grid gap-8 lg:grid-cols-[360px_1fr]"><form onSubmit={createAlbum} className="glass h-fit rounded-2xl p-6"><h2 className="font-display text-3xl">New album</h2><label className="mt-5 block text-[10px] uppercase tracking-[.16em] text-white/40">Title<input required value={albumTitle} onChange={(e)=>setAlbumTitle(e.target.value)} className="field mt-2" placeholder="Portraits"/></label><label className="mt-4 block text-[10px] uppercase tracking-[.16em] text-white/40">Description<textarea value={albumDescription} onChange={(e)=>setAlbumDescription(e.target.value)} className="field mt-2 resize-none" rows={4}/></label><button className="button-primary mt-5 w-full"><Plus size={15}/>Create album</button></form><div className="grid gap-4 sm:grid-cols-2">{albums.map((album)=><div key={album.id} className="glass overflow-hidden rounded-2xl"><div className="aspect-video bg-white/5">{album.cover_url && <img src={album.cover_url} alt="" className="h-full w-full object-cover"/>}</div><div className="p-5"><h3 className="font-display text-3xl">{album.title}</h3><p className="mt-2 line-clamp-2 text-xs leading-5 text-white/40">{album.description || "No description yet."}</p><div className="mt-5 flex gap-2"><button onClick={()=>editAlbum(album)} className="button-ghost flex-1 px-3 py-2"><Edit3 size={13}/>Edit</button><button onClick={()=>deleteAlbum(album)} className="rounded-full border border-red-500/20 p-3 text-red-400 hover:bg-red-500/10" aria-label="Delete"><Trash2 size={14}/></button></div></div></div>)}</div></div>}
      {tab === "photos" && <div className="mt-10"><div onDragOver={(e)=>e.preventDefault()} onDrop={onDrop} className="rounded-2xl border border-dashed border-white/20 bg-white/[.025] p-6 text-center sm:p-10"><UploadCloud className="mx-auto text-gold" size={32}/><h2 className="mt-4 font-display text-3xl">Drop photographs here</h2><p className="mt-2 text-xs text-white/40">JPEG, PNG, or WebP. Images are converted and optimized automatically.</p><label className="button-ghost mt-5 cursor-pointer"><Plus size={14}/>Choose files<input type="file" multiple accept="image/*" className="hidden" onChange={(e: ChangeEvent<HTMLInputElement>)=>e.target.files && addFiles(e.target.files)}/></label>{queue.length > 0 && <div className="mt-7 text-left"><div className="grid grid-cols-3 gap-3 sm:grid-cols-5">{queue.map((file,index)=><div key={`${file.name}-${index}`} className="relative aspect-square overflow-hidden rounded-lg bg-white/5"><img src={URL.createObjectURL(file)} alt="Preview" className="h-full w-full object-cover"/><button onClick={()=>setQueue((items)=>items.filter((_,i)=>i!==index))} className="absolute right-1 top-1 rounded-full bg-black/70 p-1"><X size={12}/></button></div>)}</div><div className="mt-5 grid gap-3 sm:grid-cols-2"><select value={uploadAlbum} onChange={(e)=>setUploadAlbum(e.target.value)} className="field"><option value="">No album</option>{albums.map((album)=><option key={album.id} value={album.id}>{album.title}</option>)}</select><input value={category} onChange={(e)=>setCategory(e.target.value)} className="field" placeholder="Category"/></div><button disabled={uploading} onClick={upload} className="button-primary mt-5 w-full">{uploading ? <Loader2 className="animate-spin" size={15}/> : <Check size={15}/>} {uploading ? "Optimizing & uploading..." : `Publish ${queue.length} photo${queue.length > 1 ? "s" : ""}`}</button></div>}</div><div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{photos.map((photo)=><div key={photo.id} className="glass group overflow-hidden rounded-2xl"><div className="relative aspect-[4/3] overflow-hidden bg-white/5"><img src={photo.image_url} alt={photo.alt_text} className="h-full w-full object-cover"/>{photo.featured && <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-gold px-3 py-1 text-[9px] uppercase tracking-[.13em] text-ink"><Star size={10} fill="currentColor"/>Featured</span>}</div><div className="p-4"><p className="truncate font-display text-2xl">{photo.title}</p><p className="mt-1 text-[9px] uppercase tracking-[.16em] text-white/35">{photo.category}</p><div className="mt-4 flex gap-2"><button onClick={()=>toggleFeatured(photo)} className={`rounded-full border p-2.5 ${photo.featured ? "border-gold text-gold" : "border-white/15 text-white/45"}`} title="Toggle homepage feature"><Star size={14}/></button><button onClick={()=>editPhoto(photo)} className="rounded-full border border-white/15 p-2.5 text-white/45 hover:text-white"><Edit3 size={14}/></button><button onClick={()=>deletePhoto(photo)} className="ml-auto rounded-full border border-red-500/20 p-2.5 text-red-400 hover:bg-red-500/10"><Trash2 size={14}/></button></div></div></div>)}</div></div>}
    </div>
  </div>;
}

function getDimensions(file: File): Promise<{ width: number; height: number }> { return new Promise((resolve, reject) => { const image = new Image(); const url = URL.createObjectURL(file); image.onload = () => { resolve({ width: image.naturalWidth, height: image.naturalHeight }); URL.revokeObjectURL(url); }; image.onerror = reject; image.src = url; }); }
