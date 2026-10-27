"use client";

import React from 'react';

interface TweetEmbedProps {
  authorName: string;
  handle: string;
  avatarUrl?: string;
  verified?: boolean;
  content: string;
  date: string;
  likes?: string;
  reposts?: string;
  tweetUrl?: string;
}

export function TweetCard({
  authorName,
  handle,
  avatarUrl,
  verified = true,
  content,
  date,
  likes = "4.2K",
  reposts = "1.1K",
  tweetUrl = "https://x.com"
}: TweetEmbedProps) {
  return (
    <div className="my-8 mx-auto max-w-xl bg-[#0f1117] border border-gray-800 hover:border-gray-700 transition-all rounded-2xl p-5 shadow-2xl">
      {/* Header: User Info + X Logo */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 overflow-hidden flex items-center justify-center font-bold text-white text-sm">
            {avatarUrl ? (
              <img src={avatarUrl} alt={authorName} className="w-full h-full object-cover" />
            ) : (
              authorName.charAt(0)
            )}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-white text-sm tracking-tight">{authorName}</span>
              {verified && (
                <svg className="w-4 h-4 text-sky-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              )}
            </div>
            <span className="text-gray-500 text-xs font-mono">{handle}</span>
          </div>
        </div>
        <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </div>

      {/* Tweet Body */}
      <p className="text-gray-200 text-[15px] leading-relaxed mb-4 whitespace-pre-line font-normal">
        {content}
      </p>

      {/* Date & Link */}
      <div className="text-gray-500 text-xs border-b border-gray-800/80 pb-3 mb-3 flex items-center justify-between">
        <span>{date}</span>
        <a 
          href={tweetUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sky-400 hover:underline font-semibold flex items-center gap-1 text-[11px]"
        >
          View on X
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>

      {/* Engagement Stats */}
      <div className="flex items-center gap-6 text-gray-400 text-xs">
        <div className="flex items-center gap-1.5 hover:text-pink-500 cursor-pointer transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span>{likes}</span>
        </div>
        <div className="flex items-center gap-1.5 hover:text-green-500 cursor-pointer transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          <span>{reposts}</span>
        </div>
        <div className="flex items-center gap-1.5 ml-auto text-gray-500 text-[11px]">
          <span>Verified Post</span>
        </div>
      </div>
    </div>
  );
}

export function InstagramCard({
  accountName,
  handle,
  caption,
  postUrl = "https://instagram.com"
}: {
  accountName: string;
  handle: string;
  caption: string;
  postUrl?: string;
}) {
  return (
    <div className="my-8 mx-auto max-w-xl bg-gradient-to-br from-[#1c1224] to-[#12141c] border border-pink-900/30 hover:border-pink-500/40 transition-all rounded-2xl p-5 shadow-2xl">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-0.5">
            <div className="w-full h-full bg-[#12141c] rounded-full flex items-center justify-center text-white font-bold text-xs">
              {accountName.charAt(0)}
            </div>
          </div>
          <div>
            <div className="font-bold text-white text-sm">{accountName}</div>
            <div className="text-gray-500 text-xs">{handle}</div>
          </div>
        </div>
        <div className="px-3 py-1 bg-pink-600/10 border border-pink-500/20 text-pink-400 text-[10px] font-black rounded-full uppercase tracking-wider">
          Instagram Post
        </div>
      </div>
      <p className="text-gray-200 text-sm leading-relaxed mb-3">
        {caption}
      </p>
      <a 
        href={postUrl} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="text-pink-400 hover:text-pink-300 text-xs font-semibold flex items-center gap-1"
      >
        इंस्टाग्राम पर पूरी पोस्ट देखें →
      </a>
    </div>
  );
}
