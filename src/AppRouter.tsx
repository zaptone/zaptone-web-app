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
import NotFound from "./pages/NotFound";

export function AppRouter() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <MusicLayout>        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/liked" element={<LikedSongsPage />} />
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