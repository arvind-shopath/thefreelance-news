"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { addPost, updatePost } from '@/lib/actions';

interface PostEditorProps {
  post?: any;
  categories: any[];
  onClose: () => void;
  onSave: () => void;
}

export default function PostEditor({ post, categories, onClose, onSave }: PostEditorProps) {
  const [content, setContent] = useState(post?.content || '');
  const [postType, setPostType] = useState(post?.postType || 'general');
  const [headline, setHeadline] = useState(post?.headline || '');
  const [summary, setSummary] = useState(post?.summary || '');
  const [slug, setSlug] = useState(post?.slug || '');
  const [headlineEn, setHeadlineEn] = useState(post?.headlineEn || '');
  const [summaryEn, setSummaryEn] = useState(post?.summaryEn || '');
  const [slugEn, setSlugEn] = useState(post?.slugEn || '');
  const [image, setImage] = useState(post?.image || '');
  const [category, setCategory] = useState(post?.categoryStr || categories[0]?.slug || '');
  const [subCategory, setSubCategory] = useState(post?.subCategory || '');
  const [tags, setTags] = useState(post?.tags || '');
  const [isFeatured, setIsFeatured] = useState(post?.isFeatured || false);
  const [isTrending, setIsTrending] = useState(post?.isTrending || false);
  const [isBreaking, setIsBreaking] = useState(post?.isBreaking || false);
  const [slides, setSlides] = useState<any[]>(post?.slides || [{ order: 0, title: '', content: '', image: '' }]);
  
  const editorRef = useRef<HTMLDivElement>(null);
  const [saving, setSaving] = useState(false);

  // Sync editor content with state
  useEffect(() => {
    if (editorRef.current && content && postType === 'general') {
      if (editorRef.current.innerHTML !== content) {
        editorRef.current.innerHTML = content;
      }
    }
  }, [postType]);

  const execCommand = (cmd: string, val?: string) => {
    document.execCommand(cmd, false, val);
  };

  const insertEmbed = (type: string) => {
    const url = prompt(`Enter ${type} URL:`);
    if (!url) return;
    
    let embedHtml = '';
    if (type === 'YouTube') {
      const vidId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
      embedHtml = `<div class="aspect-video mb-4"><iframe class="w-full h-full" src="https://www.youtube.com/embed/${vidId}" frameborder="0" allowfullscreen></iframe></div>`;
    } else {
      embedHtml = `<div class="mb-4 bg-gray-900 p-4 rounded text-center text-xs text-gray-500">[Embed: ${url}]</div>`;
    }
    
    if (editorRef.current) {
      editorRef.current.innerHTML += embedHtml;
    }
  };

  const handleImageDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const url = e.dataTransfer.getData('text');
    if (url && editorRef.current) {
      const imgHtml = `<img src="${url}" class="w-full rounded-2xl mb-4 border border-gray-800" alt="News Image" />`;
      editorRef.current.innerHTML += imgHtml;
    }
  };

  const handleSave = async (publishStatus: boolean = true) => {
    setSaving(true);
    const finalContent = postType === 'general' ? (editorRef.current?.innerHTML || content) : content;
    
    const formData = new FormData();
    formData.append('title', headline);
    formData.append('headline', headline);
    formData.append('slug', slug);
    formData.append('headlineEn', headlineEn);
    formData.append('summaryEn', summaryEn);
    formData.append('slugEn', slugEn);
    formData.append('image', image);
    formData.append('summary', summary);
    formData.append('content', finalContent);
    formData.append('category', category);
    formData.append('subCategory', subCategory);
    formData.append('postType', postType); // Use postType instead of type
    formData.append('tags', tags);
    if (isFeatured) formData.append('isFeatured', 'on');
    if (isTrending) formData.append('isTrending', 'on');
    if (isBreaking) formData.append('isBreaking', 'on');
    if (publishStatus) formData.append('isPublished', 'on');
    
    if (postType !== 'general') {
       formData.append('slides', JSON.stringify(slides));
    }

    try {
      if (post?.id) {
        await updatePost(post.id, formData);
      } else {
        await addPost(formData);
      }
      onSave();
    } catch (e: any) {
      console.error('Save error:', e);
      const msg = e?.message || 'खबर सेव नहीं हो सकी। कृपया दोबारा कोशिश करें।';
      alert(msg);
    } finally {
      setSaving(false);
    }
  };


  const addSlide = () => setSlides([...slides, { order: slides.length, title: '', content: '', image: '' }]);

  return (
    <div className="flex flex-col h-screen bg-[#0b0c10] text-white">
      {/* Top Header */}
      <header className="h-20 bg-[#12141c] border-b border-gray-800 px-8 flex items-center justify-between sticky top-0 z-30 shadow-2xl">
        <div className="flex items-center gap-6">
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg transition-all text-gray-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
          <div className="h-8 w-px bg-gray-800"></div>
          <div>
            <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Editing</span>
            <h2 className="text-lg font-black truncate max-w-[200px]">{headline || 'New Draft'}</h2>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <select 
            value={postType}
            onChange={(e) => setPostType(e.target.value)}
            className="bg-black text-white font-black px-4 py-3 rounded-xl border border-gray-800 text-xs uppercase tracking-widest outline-none focus:border-red-600 appearance-none cursor-pointer"
          >
            <option value="general">News Post</option>
            <option value="gallery">Photo Gallery</option>
            <option value="visual-story">Visual Story</option>
          </select>

          {post?.slug && (
            <Link 
              href={`/${category}/${slug}`} 
              target="_blank"
              className="bg-gray-800 hover:bg-gray-700 text-white font-black px-6 py-3 rounded-xl transition-all text-xs uppercase tracking-widest flex items-center gap-2"
            >
              Preview
            </Link>
          )}
          
          <div className="flex rounded-xl overflow-hidden shadow-lg">
            <button 
              onClick={() => handleSave(true)}
              disabled={saving}
              className="bg-red-600 hover:bg-red-700 disabled:bg-gray-800 text-white font-black px-8 py-3 transition-all text-xs uppercase tracking-widest"
            >
              {saving ? 'SAVING...' : 'Publish Now'}
            </button>
            <button className="bg-red-700 hover:bg-red-800 px-3 border-l border-red-800 text-white">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth="3"></path></svg>
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Meta Data */}
        <aside className="w-80 bg-[#12141c] border-r border-gray-800 overflow-y-auto p-6 flex flex-col gap-6 scrollbar-hide">
          <section className="bg-[#1a1d26] p-4 rounded-2xl border border-gray-800">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4 block">SEO Meter</label>
            <div className="relative h-24 flex flex-col items-center justify-center">
              <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden flex">
                <div className="h-full bg-red-500" style={{ width: '33%' }}></div>
                <div className="h-full bg-yellow-500" style={{ width: '33%' }}></div>
                <div className="h-full bg-green-500" style={{ width: '34%' }}></div>
              </div>
              <div 
                className="absolute top-0 w-1 h-6 bg-white shadow-lg transition-all duration-500"
                style={{ 
                  left: `${Math.max(5, Math.min(95, (post?.seoScore || 70)))}%`,
                  transform: 'translateX(-50%)'
                }}
              ></div>
              <span className="mt-4 text-2xl font-black">{post?.seoScore || 70}%</span>
            </div>
          </section>

          <section>
            <label className="text-[10px] font-black text-gray-500 mb-2 uppercase tracking-widest block">Content Type</label>
            <div className="grid grid-cols-1 gap-2">
              {[
                { label: 'Standard News', value: 'general' },
                { label: 'Photo Gallery', value: 'gallery' },
                { label: 'Visual Story', value: 'visual-story' }
              ].map(type => (
                <button
                  key={type.value}
                  onClick={() => setPostType(type.value)}
                  className={`py-3 rounded-xl text-[10px] font-black uppercase transition-all border text-left px-4 ${
                    postType === type.value ? 'bg-red-600 border-red-600 text-white' : 'bg-[#0b0c10] border-gray-800 text-gray-500 hover:border-gray-600'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </section>

          <section>
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">Category</label>
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#0b0c10] border border-gray-800 rounded-xl p-3 text-sm outline-none focus:border-red-500"
            >
              {categories.map((c: any) => (
                <option key={c.id} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </section>

          <section>
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">Tags</label>
            <input 
              value={tags} 
              onChange={(e) => setTags(e.target.value)}
              className="w-full bg-[#0b0c10] border border-gray-800 rounded-xl p-3 text-sm outline-none focus:border-red-500"
              placeholder="Tag 1, Tag 2..."
            />
          </section>

          <section>
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">Summary</label>
            <textarea 
              value={summary} 
              onChange={(e) => setSummary(e.target.value)}
              className="w-full bg-[#0b0c10] border border-gray-800 rounded-xl p-3 text-xs h-32 outline-none focus:border-red-500"
              placeholder="SEO Summary..."
            />
          </section>

          <section className="flex flex-col gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} className="accent-red-500" />
              <span className="text-xs font-bold">Featured</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={isTrending} onChange={e => setIsTrending(e.target.checked)} className="accent-red-500" />
              <span className="text-xs font-bold">Trending</span>
            </label>
          </section>
        </aside>

        {/* Main Editor Area */}
        <main className="flex-1 overflow-y-auto bg-[#0b0c10] p-12 scrollbar-hide">
          <div className="max-w-4xl mx-auto flex flex-col gap-8">
            
            <section className="bg-[#12141c] p-10 rounded-[2.5rem] border border-gray-800 shadow-inner">
              <div className="flex flex-col gap-2 mb-8">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Headline</label>
                <input 
                  type="text" 
                  value={headline} 
                  onChange={(e) => {
                    setHeadline(e.target.value);
                    if (!post) {
                      const newSlug = e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9\s-]/g, '')
                        .trim()
                        .replace(/\s+/g, '-')
                        .replace(/-+/g, '-');
                      setSlug(newSlug + (newSlug ? '-' : '') + Date.now().toString().slice(-4));
                    }
                  }}
                  className="w-full bg-transparent border-b-2 border-gray-800 focus:border-red-600 text-4xl font-black text-white outline-none py-4 transition-all"
                  placeholder="खबर की सुर्खियां यहाँ लिखें..."
                />
              </div>

              <div className="flex flex-col gap-2 mb-8">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Slug (URL)</label>
                <div className="flex items-center bg-[#0b0c10] border border-gray-800 rounded-xl px-4 py-3">
                  <span className="text-gray-600 text-xs font-bold mr-2">news.thefreelance.in/{category}/</span>
                  <input 
                    type="text" 
                    value={slug} 
                    onChange={(e) => setSlug(e.target.value)}
                    className="bg-transparent flex-1 text-sm text-white outline-none"
                    placeholder="custom-slug-here"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Featured Image URL</label>
                <div className="flex flex-col gap-4">
                  <div className="w-full h-64 bg-gray-950 rounded-2xl border-2 border-dashed border-gray-800 overflow-hidden relative flex items-center justify-center">
                    {image ? (
                      <img src={image} className="w-full h-full object-cover opacity-80" alt="Preview" />
                    ) : (
                      <span className="text-gray-700 font-bold">IMAGE PREVIEW</span>
                    )}
                  </div>
                  <input 
                    type="text" 
                    value={image} 
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full bg-[#0b0c10] border border-gray-800 rounded-xl p-4 text-sm outline-none focus:border-red-500"
                    placeholder="Paste image URL here..."
                  />
                </div>
              </div>
            </section>

            {/* Bilingual English Edition Section */}
            <section className="bg-[#12141c] p-8 rounded-[2.5rem] border border-blue-900/40 shadow-inner">
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-800">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🌐</span>
                  <div>
                    <h3 className="text-base font-bold text-white">इंग्लिश संस्करण (English Edition)</h3>
                    <p className="text-xs text-gray-400">news.thefreelance.in/en/ के लिए अंग्रेजी शीर्षक व सारांश</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Headline (English)</label>
                  <input
                    type="text"
                    value={headlineEn}
                    onChange={(e) => {
                      setHeadlineEn(e.target.value);
                      if (!slugEn) {
                        const newSlugEn = e.target.value.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-') + '-en';
                        setSlugEn(newSlugEn);
                      }
                    }}
                    placeholder="Enter English Headline for global edition..."
                    className="w-full bg-[#0b0c10] border border-gray-800 rounded-xl p-3 text-white text-base focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Summary (English)</label>
                  <textarea
                    rows={3}
                    value={summaryEn}
                    onChange={(e) => setSummaryEn(e.target.value)}
                    placeholder="Short English summary / lead paragraph..."
                    className="w-full bg-[#0b0c10] border border-gray-800 rounded-xl p-3 text-white text-xs focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Slug (English URL)</label>
                  <div className="flex items-center bg-[#0b0c10] border border-gray-800 rounded-xl px-4 py-2.5 text-xs">
                    <span className="text-gray-500 font-bold mr-2">news.thefreelance.in/en/{category}/</span>
                    <input
                      type="text"
                      value={slugEn}
                      onChange={(e) => setSlugEn(e.target.value)}
                      placeholder="english-article-slug-en"
                      className="bg-transparent flex-1 text-xs text-blue-300 outline-none"
                    />
                  </div>
                </div>
              </div>
            </section>

            {postType === 'general' ? (
              <div className="bg-[#12141c] p-10 rounded-[2.5rem] border border-gray-800">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6 block">Content Editor</label>
                <div className="flex items-center gap-2 mb-6 bg-[#0b0c10] p-2 rounded-xl border border-gray-800">
                   <button onClick={() => execCommand('bold')} className="p-2 hover:bg-gray-800 rounded font-black">B</button>
                   <button onClick={() => execCommand('italic')} className="p-2 hover:bg-gray-800 rounded italic font-serif">I</button>
                   <button onClick={() => insertEmbed('YouTube')} className="p-2 hover:bg-gray-800 rounded text-red-500 text-[10px] font-black">YOUTUBE</button>
                </div>
                <div 
                  ref={editorRef}
                  contentEditable
                  onDragOver={e => e.preventDefault()}
                  onDrop={handleImageDrop}
                  className="min-h-[500px] text-gray-200 text-xl leading-relaxed outline-none prose prose-invert max-w-none"
                ></div>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {slides.map((slide, i) => (
                  <div key={i} className="bg-[#12141c] border border-gray-800 rounded-3xl overflow-hidden p-6">
                    <h3 className="text-xs font-black text-red-500 mb-4 uppercase">Slide {i+1}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <input 
                         className="bg-[#0b0c10] border border-gray-800 rounded-xl p-3 text-sm outline-none" 
                         placeholder="Slide Image URL" 
                         value={slide.image}
                         onChange={e => {
                           const newSlides = [...slides];
                           newSlides[i].image = e.target.value;
                           setSlides(newSlides);
                         }}
                       />
                       <input 
                         className="bg-[#0b0c10] border border-gray-800 rounded-xl p-3 text-sm outline-none" 
                         placeholder="Slide Title" 
                         value={slide.title}
                         onChange={e => {
                           const newSlides = [...slides];
                           newSlides[i].title = e.target.value;
                           setSlides(newSlides);
                         }}
                       />
                    </div>
                    <textarea 
                       className="w-full bg-[#0b0c10] border border-gray-800 rounded-xl p-3 text-xs h-24 mt-4 outline-none" 
                       placeholder="Slide Content..."
                       value={slide.content}
                       onChange={e => {
                         const newSlides = [...slides];
                         newSlides[i].content = e.target.value;
                         setSlides(newSlides);
                       }}
                    />
                  </div>
                ))}
                <button onClick={addSlide} className="py-4 border-2 border-dashed border-gray-800 rounded-2xl text-gray-500 font-bold hover:border-red-500 hover:text-red-500">+ ADD SLIDE</button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
