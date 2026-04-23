import Link from "next/link";
import { Gamepad2, Heart, Github, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-background/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 
                             flex items-center justify-center">
                <Gamepad2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-lg">
                <span className="gradient-text">Game</span>
                <span>Vault</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              The premium browser gaming platform. Play, compete, and rise to the top of global leaderboards.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-lg 
                           bg-white/5 hover:bg-white/10 border border-white/10 
                           transition-all duration-200"
              >
                <Github className="w-4 h-4 text-muted-foreground" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-lg 
                           bg-white/5 hover:bg-white/10 border border-white/10 
                           transition-all duration-200"
              >
                <Twitter className="w-4 h-4 text-muted-foreground" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-sm mb-4 text-foreground/80">Games</h3>
            <ul className="space-y-2.5">
              {[
                { href: "/games/tic-tac-toe", label: "Tic Tac Toe" },
                { href: "/games/snake", label: "Snake" },
                { href: "/games/memory-match", label: "Memory Match" },
                { href: "/games/rock-paper-scissors", label: "Rock Paper Scissors" },
                { href: "/games/reaction-time", label: "Reaction Time" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-4 text-foreground/80">Platform</h3>
            <ul className="space-y-2.5">
              {[
                { href: "/leaderboard", label: "Leaderboard" },
                { href: "/games", label: "All Games" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row 
                        items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} GameVault. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-pink-500" /> for gamers everywhere
          </p>
        </div>
      </div>
    </footer>
  );
}
