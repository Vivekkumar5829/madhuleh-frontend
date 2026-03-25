import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  ShoppingCart,
  Search,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Package,
  User,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/about", label: "About" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const { user, logout, isAdmin } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const dropRef = useRef(null);

  // close mobile on route change
  useEffect(() => setMobileOpen(false), [location.pathname]);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const fn = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target))
        setUserOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  // close mobile on ESC
  useEffect(() => {
    const fn = (e) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        setSearchOpen(false);
      }
    };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchVal.trim();
    if (q) {
      navigate(`/products?q=${encodeURIComponent(q)}`);
      setSearchOpen(false);
      setSearchVal("");
    }
  };

  return (
    <>
      {/* ── Main header ─────────────────────────────────────────────── */}
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-sm shadow-[0_1px_20px_rgba(26,13,0,0.08)]"
            : "bg-cream-100"
        }`}
      >
        <div className="container">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2.5 flex-shrink-0 group"
            >
              <div className="w-8 h-8 rounded-xl overflow-hidden group-hover:scale-105 transition-transform">
                <img
                  src="https://res.cloudinary.com/dfh9jk0h6/image/upload/v1774464827/Madhuleh_pdf__2__page-0001-removebg-preview_waifu2x_art_noise3_scale_foskdi.png"
                  alt="Madhuleh"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <p className="font-display font-bold text-lg text-bark-900 leading-none tracking-tight">
                  MADHULEH
                </p>
                <p className="text-[9px] text-honey-600 font-semibold uppercase tracking-[0.15em] leading-none mt-0.5">
                  Pure Honey
                </p>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {LINKS.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === "/"}
                  className={({ isActive }) => `
                    relative px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200
                    ${
                      isActive
                        ? "text-honey-600 bg-honey-50"
                        : "text-bark-700 hover:text-bark-900 hover:bg-honey-50"
                    }
                  `}
                >
                  {label}
                </NavLink>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-0.5">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className="w-9 h-9 rounded-full flex items-center justify-center text-bark-700 hover:bg-honey-50 hover:text-bark-900 transition-colors"
              >
                <Search size={18} />
              </button>

              {/* Cart */}
              <Link
                to="/cart"
                className="relative w-9 h-9 rounded-full flex items-center justify-center text-bark-700 hover:bg-honey-50 hover:text-bark-900 transition-colors"
              >
                <ShoppingCart size={18} />
                {count > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-honey-500 text-bark-900 text-[10px] font-black rounded-full flex items-center justify-center px-1 leading-none">
                    {count > 99 ? "99+" : count}
                  </span>
                )}
              </Link>

              {/* User */}
              {user ? (
                <div className="relative ml-1" ref={dropRef}>
                  <button
                    onClick={() => setUserOpen(!userOpen)}
                    className="flex items-center gap-1.5 pl-2 pr-3 py-1.5 rounded-full hover:bg-honey-50 transition-colors group"
                  >
                    <div className="w-7 h-7 rounded-full bg-honey-500 flex items-center justify-center text-bark-900 font-black text-xs uppercase">
                      {user.firstName?.[0] || user.email?.[0] || "U"}
                    </div>
                    <span className="hidden sm:block text-sm font-semibold text-bark-900 max-w-[80px] truncate">
                      {user.firstName || user.name?.split(" ")[0] || "Account"}
                    </span>
                    <ChevronDown
                      size={13}
                      className={`text-bark-500 transition-transform ${userOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {userOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-card-hover border border-gray-100 overflow-hidden z-50 animate-fade-up">
                      <div className="px-4 py-3 border-b border-gray-100 bg-honey-50">
                        <p className="font-bold text-bark-900 text-sm">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user.email}
                        </p>
                      </div>
                      <div className="py-1">
                        <Link
                          to="/orders"
                          onClick={() => setUserOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-bark-700 hover:bg-honey-50 transition-colors"
                        >
                          <Package size={15} className="text-honey-500" /> My
                          Orders
                        </Link>
                        {isAdmin && (
                          <Link
                            to="/admin"
                            onClick={() => setUserOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-bark-700 hover:bg-honey-50 transition-colors"
                          >
                            <User size={15} className="text-honey-500" /> Admin
                            Panel
                          </Link>
                        )}
                        <div className="my-1 border-t border-gray-100" />
                        <button
                          onClick={() => {
                            logout();
                            setUserOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut size={15} /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="hidden sm:flex btn-primary btn-sm ml-2 text-sm"
                >
                  Sign In
                </Link>
              )}

              {/* Mobile menu */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden w-9 h-9 rounded-full flex items-center justify-center text-bark-700 hover:bg-honey-50 transition-colors ml-1"
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`lg:hidden bg-white border-t border-gray-100 overflow-hidden transition-all duration-300 ${
            mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="container py-4 space-y-1">
            {LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-honey-50 text-honey-600"
                      : "text-bark-700 hover:bg-gray-50"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
            {!user && (
              <Link
                to="/auth"
                className="block w-full text-center btn-primary mt-3"
              >
                Sign In / Register
              </Link>
            )}
            {user && (
              <>
                <Link
                  to="/orders"
                  className="block px-4 py-3 rounded-xl text-sm font-semibold text-bark-700 hover:bg-gray-50"
                >
                  My Orders
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="block px-4 py-3 rounded-xl text-sm font-semibold text-bark-700 hover:bg-gray-50"
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="block w-full text-left px-4 py-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50"
                >
                  Sign Out
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Spacer - exactly matches header height */}
      <div className="h-16" />

      {/* ── Search overlay ──────────────────────────────────────────── */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[100] bg-bark-900/60 backdrop-blur-sm flex items-start justify-center pt-24 px-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSearchOpen(false);
          }}
        >
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-fade-up">
            <form
              onSubmit={handleSearch}
              className="flex items-center gap-3 px-5 py-4 border-b border-gray-100"
            >
              <Search size={20} className="text-honey-500 flex-shrink-0" />
              <input
                autoFocus
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Search for honey varieties, recipes..."
                className="flex-1 text-base outline-none text-bark-900 placeholder-gray-400 bg-transparent"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-bark-900 transition-colors"
              >
                <X size={18} />
              </button>
            </form>
            <div className="px-5 py-3">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Popular Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Multi Flora Honey",
                  "Tulsi Honey",
                  "Forest Honey",
                  "Royal Jelly",
                  "Comb Honey",
                ].map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      navigate(`/products?q=${encodeURIComponent(s)}`);
                      setSearchOpen(false);
                      setSearchVal("");
                    }}
                    className="text-xs px-3 py-1.5 bg-honey-50 hover:bg-honey-100 text-bark-700 rounded-full transition-colors font-medium"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
