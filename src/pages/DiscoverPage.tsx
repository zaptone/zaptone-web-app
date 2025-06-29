import { Link } from "react-router-dom";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useNostr } from "@/hooks/useNostr";
import { Progress } from "@/components/ui/progress";

// Investment opportunities are assumed to be kind=31000 (update if a suitable NIP exists)
function useInvestmentOpportunities() {
  // TEST DATA: If no real data, show some sample projects
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
    queryKey: ["investment-opportunities"],
    queryFn: async (c) => {
      const signal = AbortSignal.any([c.signal, AbortSignal.timeout(2000)]);
      // Fetch investment opportunities from nostr (update kind if needed)
      const events = await nostr.query([
        { kinds: [31000], limit: 20, "#t": ["investment"] },
      ], { signal });
      // If no real data, return test projects
      return events.length > 0 ? events : testProjects;
    },
  });
}

export default function DiscoverPage() {
  const { data: opportunities, isLoading } = useInvestmentOpportunities();

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-10">
      <h1 className="text-3xl font-bold mb-6">Discover Music Investment Opportunities</h1>
      <div className="grid md:grid-cols-2 gap-8">
        {isLoading && (
          [1,2,3,4].map((n) => (
            <Card key={`skeleton-${n}`}>
              <CardHeader>
                <Skeleton className="h-6 w-2/3 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-8 w-24" />
              </CardFooter>
            </Card>
          ))
        )}
        {!isLoading && opportunities && opportunities.length === 0 && (
          <Card className="border-dashed col-span-full">
            <CardContent className="py-12 px-8 text-center">
              <div className="max-w-sm mx-auto space-y-6">
                <p className="text-muted-foreground">
                  No investment opportunities found. Try another relay?
                </p>
                <div className="flex justify-center">
                  <Link to="/settings">
                    <Button variant="outline">Change Relay</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        {!isLoading && opportunities && opportunities.map((event) => {
          const title = event.tags.find(([k]) => k === "title")?.[1] || "Untitled";
          const summary = event.tags.find(([k]) => k === "summary")?.[1] || "";
          const artist = event.tags.find(([k]) => k === "artist")?.[1] || "Unknown Artist";
          const goal = event.tags.find(([k]) => k === "goal")?.[1] || "-";
          const raised = event.tags.find(([k]) => k === "raised")?.[1] || "-";
          const profit = event.tags.find(([k]) => k === "profit")?.[1] || "-";
          const cover = event.tags.find(([k]) => k === "cover")?.[1];
          // Calculate progress percent (parseFloat, fallback to 0)
          const goalNum = parseFloat(goal.replace(/[^\d.]/g, ""));
          const raisedNum = parseFloat(raised.replace(/[^\d.]/g, ""));
          const progress = goalNum > 0 ? Math.min((raisedNum / goalNum) * 100, 100) : 0;
          const detailId = event.id;
          return (
            <Card key={event.id} className="flex flex-col justify-between">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                {cover && <img src={cover} alt={title} className="w-16 h-16 rounded-lg object-cover" />}
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-semibold mb-1">{title}</h2>
                  <div className="text-xs text-muted-foreground mb-1">by {artist}</div>
                  <div className="flex gap-2 text-xs mb-1">
                    <span className="bg-muted px-2 py-0.5 rounded">Goal: {goal}</span>
                    <span className="bg-muted px-2 py-0.5 rounded">Raised: {raised}</span>
                    <span className="bg-muted px-2 py-0.5 rounded">Profit: {profit}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">Progress</span>
                    <div className="flex-1">
                      <Progress value={progress} />
                    </div>
                    <span className="text-xs font-medium min-w-[32px] text-right">{Math.round(progress)}%</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-base line-clamp-3 mb-2">{summary}</p>
              </CardContent>
              <CardFooter className="flex items-center justify-between mt-auto">
                <a href={`/discover/${detailId}`}>
                  <Button variant="default">View Details</Button>
                </a>
                <Button variant="default">Invest</Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
