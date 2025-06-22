# Install NPM packages
$npmPackages = @(
  "@unhead/addons", "@unhead/react", "class-variance-authority", "clsx", "cmdk", "date-fns",
  "embla-carousel-react", "input-otp", "lucide-react", "next-themes", "nostr-tools", "react",
  "react-day-picker", "react-dom", "react-hook-form", "react-resizable-panels", "react-router-dom",
  "recharts", "sonner", "tailwind-merge", "tailwindcss-animate", "vaul", "zod"
)

$npmInstallCommand = "npm install " + ($npmPackages -join " ")
Write-Host "Installing NPM packages..."
Invoke-Expression $npmInstallCommand
