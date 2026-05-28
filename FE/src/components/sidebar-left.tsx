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
    <Sidebar
      className="border-r border-white/10 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 text-white"
      {...props}
    >
      {/* App Logo / Brand */}
      <SidebarHeader>
        <div className="flex h-16 items-center gap-3 px-4 border-b border-white/10">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/25">
            <MessageCircle className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight">
              ChatterBox
            </h1>
            <p className="text-[10px] font-medium text-gray-400 tracking-wide uppercase">
              Community Chat
            </p>
          </div>
        </div>
      </SidebarHeader>

      {/* Main Navigation */}
      <SidebarContent className="py-3">
        {/* Primary Nav Section */}
        <div className="px-3 mb-2">
          <p className="px-2 text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-2">
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
          <p className="px-2 text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-2">
            Support
          </p>
          <SidebarSecondaryNav items={data.navSecondary} />
        </div>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t border-white/10 p-3">
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-white text-xs font-bold shadow-lg shadow-violet-500/20">
            D
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate group-hover:text-violet-300 transition-colors">
              Demo User
            </p>
            <p className="text-xs text-gray-400 truncate">demo@example.com</p>
          </div>
          <div className="flex h-6 w-6 items-center justify-center rounded-lg hover:bg-white/10 transition-colors">
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
            className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              isActive
                ? "bg-gradient-to-r from-violet-500/20 to-purple-500/10 text-white shadow-sm border border-violet-500/20"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <div
              className={`flex h-5 w-5 items-center justify-center transition-colors duration-200 ${
                isActive
                  ? "text-violet-400"
                  : "text-gray-500 group-hover:text-violet-400"
              }`}
            >
              <item.icon className="h-5 w-5" />
            </div>
            <span className="flex-1">{item.title}</span>
            {item.badge && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-violet-500/20 px-1.5 text-[10px] font-bold text-violet-300">
                {item.badge}
              </span>
            )}
            {isActive && (
              <div className="h-1.5 w-1.5 rounded-full bg-violet-400" />
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
          className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200"
        >
          <div className="flex h-5 w-5 items-center justify-center text-gray-500 group-hover:text-violet-400 transition-colors duration-200">
            <item.icon className="h-5 w-5" />
          </div>
          <span>{item.title}</span>
        </a>
      ))}
    </nav>
  );
}
