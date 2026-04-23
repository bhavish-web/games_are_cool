"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Gamepad2, Trophy, Volume2, VolumeX, Sun, Moon, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/useTheme";
import { useSound } from "@/hooks/useSound";
import { usePlayer } from "@/hooks/usePlayer";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/games", label: "Games" },
  { href: "/leaderboard", label: "Leaderboard" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { soundEnabled, setSoundEnabled } = useSound();
  const { player } = usePlayer();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-background/80 backdrop-blur-xl border-b border-white/5 shadow-xl shadow-black/10"
            : "bg-transparent"
        )}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <motion.div
                whileHover={{ rotate: 20, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400 }}
                className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 
                           flex items-center justify-center shadow-lg shadow-purple-500/30"
              >
                <Gamepad2 className="w-5 h-5 text-white" />
              </motion.div>
              <span className="font-display font-bold text-lg tracking-tight">
                <span className="gradient-text">Game</span>
                <span className="text-foreground">Vault</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200",
                    pathname === link.href
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {pathname === link.href && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute inset-0 bg-white/10 rounded-lg"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              {/* Sound Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="w-9 h-9 flex items-center justify-center rounded-lg 
                           bg-white/5 hover:bg-white/10 border border-white/10 
                           transition-all duration-200"
                title={soundEnabled ? "Mute sounds" : "Enable sounds"}
              >
                {soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <VolumeX className="w-4 h-4 text-muted-foreground" />
                )}
              </motion.button>

              {/* Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className="w-9 h-9 flex items-center justify-center rounded-lg 
                           bg-white/5 hover:bg-white/10 border border-white/10 
                           transition-all duration-200"
                title="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <Moon className="w-4 h-4 text-muted-foreground" />
                )}
              </motion.button>

              {/* Player Avatar */}
              {player && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="hidden sm:flex items-center gap-2 px-3 py-1.5 
                             rounded-lg bg-white/5 border border-white/10"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 
                                  flex items-center justify-center text-xs font-bold text-white">
                    {player.name[0].toUpperCase()}
                  </div>
                  <span className="text-sm text-muted-foreground max-w-[80px] truncate">
                    {player.name}
                  </span>
                </motion.div>
              )}

              {/* Leaderboard */}
              <Link href="/leaderboard">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg 
                             bg-gradient-to-r from-purple-600 to-blue-600 
                             text-white text-sm font-medium shadow-lg shadow-purple-500/25
                             hover:shadow-purple-500/40 transition-all duration-200"
                >
                  <Trophy className="w-4 h-4" />
                  <span>Leaderboard</span>
                </motion.div>
              </Link>

              {/* Mobile Menu */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg 
                           bg-white/5 border border-white/10"
              >
                {isMobileMenuOpen ? (
                  <X className="w-4 h-4" />
                ) : (
                  <Menu className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden bg-background/95 backdrop-blur-xl border-b border-white/5"
            >
              <div className="px-4 py-4 space-y-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      pathname === link.href
                        ? "bg-white/10 text-foreground"
                        : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/leaderboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg 
                             bg-gradient-to-r from-purple-600 to-blue-600 
                             text-white text-sm font-medium mt-2"
                >
                  <Trophy className="w-4 h-4" />
                  Leaderboard
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
