import { useParams, Link } from "react-router-dom";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useNostr } from "@/hooks/useNostr";


function useInvestmentDetail(id: string) {
  // Same test data as DiscoverPage
  const testProjects = [
    {
      id: 'test-1',
      tags: [
        ['title', 'Indie Album Launch'],
        ['summary', 'Support the debut album of an up-and-coming indie band.'],
        ['artist', 'The Indie Stars'],
        ['goal', '0.12 BTC'],
        ['raised', '0.051 BTC'],
        ['profit', '12%'],
        ['cover', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=facearea&w=400&h=400&q=80'],
      ],
    },
    {
      id: 'test-2',
      tags: [
        ['title', 'Live Concert in Berlin'],
        ['summary', 'Help fund a live concert event for electronic music fans.'],
        ['artist', 'DJ Berlin'],
        ['goal', '0.19 BTC'],
        ['raised', '0.083 BTC'],
        ['profit', '15%'],
        ['cover', 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=400&h=400&q=80'],
      ],
    },
    {
      id: 'test-3',
      tags: [
        ['title', 'Music Video Production'],
        ['summary', 'Invest in a high-quality music video for a rising pop artist.'],
        ['artist', 'Pop Queen'],
        ['goal', '0.07 BTC'],
        ['raised', '0.028 BTC'],
        ['profit', '10%'],
        ['cover', 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=400&h=400&q=80'],
      ],
    },
  ];
  const { nostr } = useNostr();
  return useQuery({
    queryKey: ["investment-detail", id],
    queryFn: async (c) => {
      const signal = AbortSignal.any([c.signal, AbortSignal.timeout(2000)]);
      const events = await nostr.query([
        { kinds: [31000], ids: [id], limit: 1 },
      ], { signal });
      if (events.length > 0) return events[0];
      return testProjects.find((p) => p.id === id) || null;
    },
    enabled: !!id,
  });
}

export default function InvestmentDetailPage() {
  const { id } = useParams<{ id?: string }>();
  const { data: event, isLoading } = useInvestmentDetail(id || "");

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <Card>
          <CardHeader>
            <Skeleton className="h-7 w-1/2 mb-2" />
            <Skeleton className="h-4 w-1/3" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-8 w-32 mt-4" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4">
        <Card>
          <CardContent className="py-12 px-8 text-center">
            <p className="text-muted-foreground">Investment opportunity not found.</p>
            <Link to="/discover">
              <Button variant="outline" className="mt-6">Back to Discover</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const title = event.tags.find(([k]) => k === "title")?.[1] || "Untitled";
  const summary = event.tags.find(([k]) => k === "summary")?.[1] || "";
  const artist = event.tags.find(([k]) => k === "artist")?.[1] || "Unknown Artist";
  const goal = event.tags.find(([k]) => k === "goal")?.[1] || "-";
  const raised = event.tags.find(([k]) => k === "raised")?.[1] || "-";
  const profit = event.tags.find(([k]) => k === "profit")?.[1] || "-";
  const cover = event.tags.find(([k]) => k === "cover")?.[1];

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <Card>
        <CardHeader className="flex flex-row items-center gap-6 pb-2">
          {cover && <img src={cover} alt={title} className="w-24 h-24 rounded-xl object-cover" />}
          <div>
            <h1 className="text-2xl font-bold mb-2">{title}</h1>
            <div className="text-muted-foreground text-sm mb-2">By {artist}</div>
            <div className="flex gap-3 text-xs">
              <span className="bg-muted px-2 py-0.5 rounded">Goal: {goal}</span>
              <span className="bg-muted px-2 py-0.5 rounded">Raised: {raised}</span>
              <span className="bg-muted px-2 py-0.5 rounded">Profit: {profit}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <p className="text-base font-medium mb-1">Project Summary</p>
            <p className="text-muted-foreground mb-2">{summary}</p>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <Link to="/discover">
            <Button variant="outline">Back</Button>
          </Link>
          <Button variant="default">Invest</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
