import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Package, CheckCircle2, Truck, Home } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/track")({
  component: TrackPage,
});

const STAGES = [
  { id: "order placed", icon: Package, label: "Order Placed" },
  { id: "processing", icon: Search, label: "Processing" },
  { id: "shipped", icon: Truck, label: "Shipped" },
  { id: "out for delivery", icon: Home, label: "Out for Delivery" },
  { id: "delivered", icon: CheckCircle2, label: "Delivered" },
];

function TrackPage() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const res = await fetch("/api/admin/orders");
      const orders = await res.json();
      const found = orders.find((o: any) => o.id.toLowerCase() === orderId.toLowerCase().trim());
      if (found) {
        setOrder(found);
      } else {
        setError("Order not found. Please check your Order ID.");
      }
    } catch {
      setError("Failed to fetch order status. Please try again.");
    }
    setLoading(false);
  };

  const getStageIndex = (status: string) => STAGES.findIndex((s) => s.id === status.toLowerCase());

  return (
    <div className="min-h-screen bg-muted/20 py-20 px-4">
      <div className="mx-auto max-w-3xl">
        <div className="text-center mb-10">
          <h1 className="font-display text-5xl sm:text-6xl text-foreground">Track Your Order</h1>
          <p className="mt-4 text-muted-foreground max-w-md mx-auto">
            Enter your Order ID below to see real-time updates on your package.
          </p>
        </div>

        <div className="bg-background rounded-3xl border border-border/50 shadow-xl overflow-hidden p-6 sm:p-10 backdrop-blur-sm">
          <form onSubmit={handleTrack} className="flex gap-3 max-w-md mx-auto relative z-10">
            <Input
              type="text"
              placeholder="e.g. ORD-12345"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="h-14 text-lg rounded-full px-6 bg-muted/50 border-border"
            />
            <Button type="submit" className="h-14 rounded-full px-8 text-base font-semibold shadow-lg hover:shadow-xl transition-all" disabled={loading}>
              {loading ? "Searching..." : "Track"}
            </Button>
          </form>

          {error && (
            <p className="mt-6 text-center text-destructive font-medium animate-in fade-in slide-in-from-bottom-2">
              {error}
            </p>
          )}

          {order && (
            <div className="mt-12 animate-in fade-in slide-in-from-bottom-4">
              <div className="bg-muted/30 rounded-2xl p-6 border border-border/50 mb-10 text-center">
                <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Order Details</p>
                <h3 className="text-3xl font-display mt-2">{order.id}</h3>
                <p className="text-muted-foreground mt-1">Placed on {new Date(order.date).toLocaleDateString()}</p>
                <div className="mt-4 inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full font-medium">
                  <Package className="w-4 h-4" />
                  {order.items}
                </div>
              </div>

              <div className="relative">
                <div className="absolute left-6 sm:left-1/2 top-0 bottom-0 w-0.5 bg-border/50 -translate-x-1/2 rounded-full" />
                
                <div className="space-y-12">
                  {STAGES.map((stage, i) => {
                    const currentIndex = getStageIndex(order.status);
                    const isCompleted = i <= currentIndex;
                    const isCurrent = i === currentIndex;
                    const Icon = stage.icon;

                    return (
                      <div key={stage.id} className={`relative flex items-center gap-6 sm:justify-center ${isCompleted ? 'opacity-100' : 'opacity-40 grayscale'}`}>
                        {/* Desktop alternating layout */}
                        <div className="hidden sm:block w-1/2 text-right pr-12">
                          {i % 2 === 0 && (
                            <div className={`animate-in slide-in-from-right-4 fade-in duration-500 delay-${i * 100}`}>
                              <h4 className={`text-xl font-bold ${isCurrent ? 'text-primary' : 'text-foreground'}`}>{stage.label}</h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                {isCompleted ? (isCurrent ? 'In progress' : 'Completed') : 'Pending'}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Node */}
                        <div className={`absolute left-6 sm:left-1/2 -translate-x-1/2 w-12 h-12 rounded-full flex items-center justify-center border-4 border-background z-10 transition-all duration-500
                          ${isCompleted ? 'bg-primary text-primary-foreground shadow-[0_0_20px_rgba(var(--primary),0.3)]' : 'bg-muted text-muted-foreground'}
                          ${isCurrent ? 'scale-110 ring-4 ring-primary/20' : ''}
                        `}>
                          <Icon className="w-5 h-5" />
                        </div>

                        {/* Mobile text + Desktop right text */}
                        <div className="pl-16 sm:pl-12 sm:w-1/2">
                          {(i % 2 !== 0 || window.innerWidth < 640) && (
                            <div className={`animate-in slide-in-from-left-4 fade-in duration-500 delay-${i * 100}`}>
                              <h4 className={`text-xl font-bold ${isCurrent ? 'text-primary' : 'text-foreground'}`}>{stage.label}</h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                {isCompleted ? (isCurrent ? 'In progress' : 'Completed') : 'Pending'}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
