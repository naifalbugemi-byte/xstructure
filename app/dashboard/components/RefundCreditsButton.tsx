"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

export function RefundCreditsButton({ creditsUsed }: { creditsUsed: number }) {
  const [loading, setLoading] = useState(false);

  const handleRefund = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/credits/refund", { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        toast({
          title: "???",
          description: data.error || "???? ????? ?????????",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "?? ?????????",
        description: "?? ??????? ???????? ??? ???????? ??",
      });
    } catch (err) {
      toast({
        title: "?????",
        description: "??? ??? ??? ?????",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleRefund} disabled={loading || creditsUsed <= 0}>
      {loading ? "???? ???????..." : "??????? ????????"}
    </Button>
  );
}
