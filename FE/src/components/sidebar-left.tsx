"use client";

import * as React from "react";
import {
  AudioWaveform,
  Blocks,
  Calendar,
  Command,
  Home,
  Inbox,
  MessageCircle,
  MessageCircleQuestion,
  Search,
  Settings2,
  Sparkles,
  Trash2,
  Globe,
  LogOut,
  HelpCircle,
  User,
  ChevronDown,
  Bell,
} from "lucide-react";

import { NavFavorites } from "@/components/nav-favorites";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavWorkspaces } from "@/components/nav-workspaces";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  SidebarFooter,
} from "@/components/ui/sidebar";

const data = {
  navMain: [
    {
      title: "Home",
      url: "/",
      icon: Home,
    },
    {
      title: "Public Chat",
      url: "/public-chat",
      icon: Globe,
    },
    {
      title: "Inbox",
      url: "/inbox",
      icon: Inbox,
      badge: "3",
    },
    {
      title: "Search",
      url: "/search",
      icon: Search,
    },
  ],

  navSecondary: [
    {
      title: "Help",
      url: "/help",
      icon: HelpCircle,
    },
    {
      title: "Trash",
      url: "/trash",
      icon: Trash2,
    },
  ],
};

export function SidebarLeft({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const [activeItem, setActiveItem] = React.useState("Public Chat");

  return (
    <Sidebar className="sidebar-gradient border-r border-white/10" {...props}>
      {/* App Logo / Brand - Larger avatar */}
      <SidebarHeader>
        <div className="flex h-20 items-center gap-3.5 px-4 border-b border-purple-100/60 dark:border-white/5 bg-gradient-to-r from-purple-50/30 to-transparent">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/30 animate-glow-pulse">
            <MessageCircle className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-900 dark:text-white tracking-tight">
              ChatterBox
            </h1>
            <p className="text-[10px] font-semibold text-violet-600 dark:text-violet-400 tracking-wide uppercase">
              Community Chat
            </p>
          </div>
        </div>
      </SidebarHeader>

      {/* Main Navigation */}
      <SidebarContent className="py-3">
        {/* Primary Nav Section */}
        <div className="px-3 mb-3">
          <p className="px-3 text-[10px] font-bold text-violet-500 dark:text-violet-400 uppercase tracking-widest mb-2">
            Main Menu
          </p>
          <SidebarMainNav
            items={data.navMain}
            activeItem={activeItem}
            onItemClick={setActiveItem}
          />
        </div>

        {/* Secondary Nav Section */}
        <div className="px-3 mt-4 mb-2">
          <p className="px-3 text-[10px] font-bold text-violet-500 dark:text-violet-400 uppercase tracking-widest mb-2">
            Support
          </p>
          <SidebarSecondaryNav items={data.navSecondary} />
        </div>
      </SidebarContent>

      {/* Footer - Larger user avatar */}
      <SidebarFooter className="border-t border-purple-100/60 dark:border-white/5 p-3 bg-gradient-to-r from-purple-50/20 to-transparent">
        <div className="flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50/50 transition-all duration-200 cursor-pointer group">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-white text-sm font-bold shadow-lg shadow-violet-500/30 ring-2 ring-white dark:ring-gray-800">
            D
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 dark:text-white truncate group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors">
              Demo User
            </p>
            <p className="text-xs text-gray-400 truncate flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block"></span>
              Online
            </p>
          </div>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-violet-100 dark:hover:bg-white/10 transition-all duration-200">
            <LogOut className="h-4 w-4 text-gray-400 group-hover:text-red-400 transition-colors" />
          </div>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

function SidebarMainNav({
  items,
  activeItem,
  onItemClick,
}: {
  items: { title: string; url: string; icon: any; badge?: string }[];
  activeItem: string;
  onItemClick: (title: string) => void;
}) {
  return (
    <nav className="space-y-0.5">
      {items.map((item) => {
        const isActive = item.title === activeItem;
        return (
          <a
            key={item.title}
            href={item.url}
            onClick={() => onItemClick(item.title)}
            className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              isActive
                ? "menu-item-active"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50/50 dark:hover:from-white/5 dark:hover:to-transparent"
            }`}
          >
            {/* Active indicator bar */}
            {isActive && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-full bg-gradient-to-b from-violet-500 to-purple-600 shadow-sm shadow-violet-500/50" />
            )}
            <div
              className={`flex h-5 w-5 items-center justify-center transition-all duration-200 ${
                isActive
                  ? "text-white"
                  : "text-gray-400 group-hover:text-violet-500 dark:group-hover:text-violet-400"
              }`}
            >
              <item.icon className="h-5 w-5" />
            </div>
            <span className={`flex-1 ${isActive ? "font-semibold" : ""}`}>
              {item.title}
            </span>
            {item.badge && (
              <span
                className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${
                  isActive
                    ? "bg-white/25 text-white"
                    : "bg-violet-100 dark:bg-violet-500/20 text-violet-600 dark:text-violet-300"
                }`}
              >
                {item.badge}
              </span>
            )}
          </a>
        );
      })}
    </nav>
  );
}

function SidebarSecondaryNav({
  items,
}: {
  items: { title: string; url: string; icon: any }[];
}) {
  return (
    <nav className="space-y-0.5">
      {items.map((item) => (
        <a
          key={item.title}
          href={item.url}
          className="group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50/50 dark:hover:from-white/5 dark:hover:to-transparent transition-all duration-200"
        >
          <div className="flex h-5 w-5 items-center justify-center text-gray-400 group-hover:text-violet-500 dark:group-hover:text-violet-400 transition-colors duration-200">
            <item.icon className="h-5 w-5" />
          </div>
          <span>{item.title}</span>
        </a>
      ))}
    </nav>
  );
}
