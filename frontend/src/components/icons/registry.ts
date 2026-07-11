import type { LucideIcon } from 'lucide-react';
import {
  Home, Store, LayoutGrid, Search, ShoppingCart, Package, Heart,
  User, Settings, MessageCircle, Bell, Headphones, Globe, CircleDollarSign,
  HelpCircle, LogOut, Box, Truck, Warehouse, Percent, Ticket, Gift,
  Megaphone, Zap, TrendingUp, Award, Sparkles, BadgeCheck, Flame,
  Tag, Barcode, QrCode, Users, Shield, ShieldCheck, Bike,
  UserCheck, UserX, Crown, Wallet, CreditCard, Landmark, Banknote,
  ArrowLeftRight, FileText, Receipt, Coins, RotateCcw,
  TrendingDown, ArrowDownToLine, ArrowUpFromLine, MapPin, Navigation,
  Map, Clock, Route, PackageCheck, PackageX, Phone, Video, Mail,
  Radio, LifeBuoy, Image, Images, Camera, Scan,
  Maximize2, GitCompare, Share2, Download, Upload, FileCheck,
  BadgePercent, BookOpen, BarChart3, PieChart, Calendar,
  ListTodo, FileBarChart, ScrollText, Gauge, Activity, Lock, Unlock,
  KeyRound, Fingerprint, ScanFace, BadgeAlert, Eye, Database,
  Plus, Minus, Pencil, Trash2, Save, Copy, ClipboardPaste, CopyPlus,
  RefreshCw, Filter, ArrowUpDown, Printer, FileUp, FileDown,
  ExternalLink, X, ChevronLeft, ChevronRight, ChevronDown, ChevronUp,
  Check, Loader2, Hourglass, CheckCircle, XCircle, Ban, Undo2,
  CircleCheck, AlertCircle, Wifi, WifiOff, ShoppingBag, Star,
  Inbox, BellOff, SearchX, WifiOff as NoInternet, Wrench, AlertTriangle,
  Moon, Sun, Monitor, Send, ArrowLeft, EyeOff, Menu, MoreHorizontal,
  SlidersHorizontal, CircleDot,
} from 'lucide-react';

/** All icon names — single source of truth for the marketplace */
export type IconName =
  /* Navigation */
  | 'home' | 'marketplace' | 'categories' | 'search' | 'cart' | 'orders'
  | 'wishlist' | 'profile' | 'settings' | 'messages' | 'notifications'
  | 'support' | 'language' | 'currency' | 'help' | 'logout'
  /* Marketplace */
  | 'store' | 'product' | 'package' | 'delivery' | 'warehouse' | 'inventory'
  | 'discount' | 'coupon' | 'gift' | 'promotion' | 'flash-sale' | 'trending'
  | 'best-seller' | 'new-arrival' | 'verified-seller' | 'official-store'
  | 'limited-offer' | 'hot-deal' | 'price-tag' | 'barcode' | 'qr-code'
  /* Users */
  | 'user' | 'users' | 'seller' | 'admin' | 'moderator' | 'courier'
  | 'customer' | 'verified-user' | 'guest' | 'premium-user'
  /* Commerce */
  | 'wallet' | 'credit-card' | 'bank-card' | 'cash' | 'transfer'
  | 'invoice' | 'receipt' | 'commission' | 'tax' | 'refund' | 'profit'
  | 'statistics' | 'revenue' | 'expense' | 'balance' | 'withdrawal' | 'deposit'
  /* Logistics */
  | 'truck' | 'shipping' | 'location' | 'gps' | 'map' | 'pin' | 'route'
  | 'delivery-time' | 'tracking' | 'delivered' | 'cancelled-delivery'
  /* Communication */
  | 'chat' | 'message' | 'call' | 'video-call' | 'email' | 'announcement'
  | 'broadcast' | 'live-chat' | 'support-ticket' | 'faq'
  /* Product */
  | 'image' | 'gallery' | 'video' | 'camera' | '3d-view' | 'zoom' | 'favorite'
  | 'compare' | 'share' | 'download' | 'upload' | 'specification'
  | 'warranty' | 'certificate' | 'manual'
  /* Dashboard */
  | 'analytics' | 'chart' | 'pie-chart' | 'bar-chart' | 'growth'
  | 'calendar' | 'clock' | 'tasks' | 'reports' | 'logs' | 'performance' | 'activity'
  /* Security */
  | 'shield' | 'shield-check' | 'lock' | 'unlock' | 'password'
  | 'fingerprint' | 'face-id' | 'verification' | 'security-alert'
  | 'privacy' | 'backup' | 'restore'
  /* Actions */
  | 'add' | 'remove' | 'edit' | 'delete' | 'save' | 'copy' | 'paste'
  | 'duplicate' | 'refresh' | 'reload' | 'filter' | 'sort' | 'print'
  | 'export' | 'import' | 'open' | 'close' | 'back' | 'forward'
  | 'expand' | 'collapse' | 'menu' | 'more'
  /* Status */
  | 'pending' | 'confirmed' | 'approved' | 'rejected' | 'cancelled'
  | 'returned' | 'completed' | 'failed' | 'in-progress' | 'online'
  | 'offline' | 'busy' | 'available'
  /* Empty states */
  | 'no-products' | 'no-orders' | 'no-messages' | 'no-notifications'
  | 'no-results' | 'empty-cart' | 'no-internet' | 'error' | 'maintenance'
  /* Misc UI */
  | 'star' | 'shopping-bag' | 'sparkles' | 'send' | 'eye' | 'eye-off'
  | 'moon' | 'sun' | 'monitor' | 'check' | 'loading';

export const ICON_REGISTRY: Record<IconName, LucideIcon> = {
  home: Home,
  marketplace: Store,
  categories: LayoutGrid,
  search: Search,
  cart: ShoppingCart,
  orders: Package,
  wishlist: Heart,
  profile: User,
  settings: Settings,
  messages: MessageCircle,
  notifications: Bell,
  support: Headphones,
  language: Globe,
  currency: CircleDollarSign,
  help: HelpCircle,
  logout: LogOut,

  store: Store,
  product: Box,
  package: Package,
  delivery: Truck,
  warehouse: Warehouse,
  inventory: Warehouse,
  discount: Percent,
  coupon: Ticket,
  gift: Gift,
  promotion: Megaphone,
  'flash-sale': Zap,
  trending: TrendingUp,
  'best-seller': Award,
  'new-arrival': Sparkles,
  'verified-seller': BadgeCheck,
  'official-store': Store,
  'limited-offer': Flame,
  'hot-deal': Flame,
  'price-tag': Tag,
  barcode: Barcode,
  'qr-code': QrCode,

  user: User,
  users: Users,
  seller: Store,
  admin: Shield,
  moderator: ShieldCheck,
  courier: Bike,
  customer: User,
  'verified-user': UserCheck,
  guest: UserX,
  'premium-user': Crown,

  wallet: Wallet,
  'credit-card': CreditCard,
  'bank-card': Landmark,
  cash: Banknote,
  transfer: ArrowLeftRight,
  invoice: FileText,
  receipt: Receipt,
  commission: Coins,
  tax: Receipt,
  refund: RotateCcw,
  profit: TrendingUp,
  statistics: BarChart3,
  revenue: TrendingUp,
  expense: TrendingDown,
  balance: Wallet,
  withdrawal: ArrowDownToLine,
  deposit: ArrowUpFromLine,

  truck: Truck,
  shipping: Truck,
  location: MapPin,
  gps: Navigation,
  map: Map,
  pin: MapPin,
  route: Route,
  'delivery-time': Clock,
  tracking: Package,
  delivered: PackageCheck,
  'cancelled-delivery': PackageX,

  chat: MessageCircle,
  message: MessageCircle,
  call: Phone,
  'video-call': Video,
  email: Mail,
  announcement: Megaphone,
  broadcast: Radio,
  'live-chat': MessageCircle,
  'support-ticket': LifeBuoy,
  faq: HelpCircle,

  image: Image,
  gallery: Images,
  video: Video,
  camera: Camera,
  '3d-view': Scan,
  zoom: Maximize2,
  favorite: Heart,
  compare: GitCompare,
  share: Share2,
  download: Download,
  upload: Upload,
  specification: FileCheck,
  warranty: BadgePercent,
  certificate: BadgeCheck,
  manual: BookOpen,

  analytics: BarChart3,
  chart: BarChart3,
  'pie-chart': PieChart,
  'bar-chart': BarChart3,
  growth: TrendingUp,
  calendar: Calendar,
  clock: Clock,
  tasks: ListTodo,
  reports: FileBarChart,
  logs: ScrollText,
  performance: Gauge,
  activity: Activity,

  shield: Shield,
  'shield-check': ShieldCheck,
  lock: Lock,
  unlock: Unlock,
  password: KeyRound,
  fingerprint: Fingerprint,
  'face-id': ScanFace,
  verification: BadgeCheck,
  'security-alert': BadgeAlert,
  privacy: Eye,
  backup: Database,
  restore: RotateCcw,

  add: Plus,
  remove: Minus,
  edit: Pencil,
  delete: Trash2,
  save: Save,
  copy: Copy,
  paste: ClipboardPaste,
  duplicate: CopyPlus,
  refresh: RefreshCw,
  reload: RefreshCw,
  filter: Filter,
  sort: ArrowUpDown,
  print: Printer,
  export: FileDown,
  import: FileUp,
  open: ExternalLink,
  close: X,
  back: ChevronLeft,
  forward: ChevronRight,
  expand: ChevronDown,
  collapse: ChevronUp,
  menu: Menu,
  more: MoreHorizontal,

  pending: Hourglass,
  confirmed: CheckCircle,
  approved: CircleCheck,
  rejected: XCircle,
  cancelled: Ban,
  returned: Undo2,
  completed: CheckCircle,
  failed: AlertCircle,
  'in-progress': Loader2,
  online: CircleDot,
  offline: WifiOff,
  busy: Clock,
  available: Check,

  'no-products': Box,
  'no-orders': Package,
  'no-messages': Inbox,
  'no-notifications': BellOff,
  'no-results': SearchX,
  'empty-cart': ShoppingCart,
  'no-internet': NoInternet,
  error: AlertTriangle,
  maintenance: Wrench,

  star: Star,
  'shopping-bag': ShoppingBag,
  sparkles: Sparkles,
  send: Send,
  eye: Eye,
  'eye-off': EyeOff,
  moon: Moon,
  sun: Sun,
  monitor: Monitor,
  check: Check,
  loading: Loader2,
};

/** Human-readable labels for accessibility (screen readers) */
export const ICON_LABELS: Partial<Record<IconName, string>> = {
  home: 'Асосӣ',
  search: 'Ҷустуҷӯ',
  cart: 'Сабад',
  wishlist: 'Дӯстдошта',
  profile: 'Профил',
  notifications: 'Огоҳиҳо',
  messages: 'Паёмҳо',
  settings: 'Танзимот',
  logout: 'Баромад',
  favorite: 'Дӯстдошта',
  add: 'Илова',
  delete: 'Нест кардан',
  edit: 'Таҳрир',
  back: 'Бозгашт',
  close: 'Пӯшидан',
};
