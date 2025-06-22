import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ScrollToTop } from "./components/ScrollToTop";
import { MusicLayout } from "./components/MusicLayout";
import HomePage from "./pages/HomePage";
import { SearchPage } from "./pages/SearchPage";
import { LibraryPage } from "./pages/LibraryPage";
import { UploadPage } from "./pages/UploadPage";
import { LikedSongsPage } from "./pages/LikedSongsPage";
import { ProfilePage } from "./pages/ProfilePage";
import { SettingsPage } from "./pages/SettingsPage";
import { PremiumPage } from "./pages/PremiumPage";
import { TrendingPage } from "./pages/TrendingPage";
import { RadioPage } from "./pages/RadioPage";
import { ChartsPage } from "./pages/ChartsPage";
import { NewReleasesPage } from "./pages/NewReleasesPage";
import { RecentlyPlayedPage } from "./pages/RecentlyPlayedPage";
import { DownloadedPage } from "./pages/DownloadedPage";
import { MadeForYouPage } from "./pages/MadeForYouPage";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import NotFound from "./pages/NotFound";
import { LiveStreamPage } from "./pages/LiveStreamPage";
import { StorePage } from "./pages/StorePage";
import { LiveStreamingPage } from "./pages/LiveStreamingPage";
import { MerchandiseStorePage } from "./pages/MerchandiseStorePage";

export function AppRouter() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <MusicLayout>        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/liked" element={<LikedSongsPage />} />          <Route path="/live" element={<LiveStreamPage />} />
          <Route path="/live-streaming" element={<LiveStreamingPage />} />
          <Route path="/store" element={<StorePage />} />
          <Route path="/merchandise" element={<MerchandiseStorePage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/trending" element={<TrendingPage />} />
          <Route path="/radio" element={<RadioPage />} />
          <Route path="/charts" element={<ChartsPage />} />
          <Route path="/new" element={<NewReleasesPage />} />
          <Route path="/recent" element={<RecentlyPlayedPage />} />
          <Route path="/downloads" element={<DownloadedPage />} />
          <Route path="/for-you" element={<MadeForYouPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/premium" element={<PremiumPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </MusicLayout>
    </BrowserRouter>
  );
}
export default AppRouter;