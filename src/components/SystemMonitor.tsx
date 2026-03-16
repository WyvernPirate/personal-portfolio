import React, { useState, useEffect } from "react";

const SystemMonitor = () => {
  const [stats, setStats] = useState({
    cpu: 18,
    ram: 42,
    disk: 64,
    coffee: 85,
    uptime: "02:45:12"
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        cpu: Math.floor(Math.random() * 20) + 10,
        ram: Math.floor(Math.random() * 5) + 40,
        coffee: Math.max(0, prev.coffee - 0.1)
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const renderBar = (percent: number, color: string) => {
    const totalBars = 15;
    const activeBars = Math.floor((percent / 100) * totalBars);
    return (
      <span className="font-mono">
        <span className={color}>{"#".repeat(activeBars)}</span>
        <span className="opacity-20">{"-".repeat(totalBars - activeBars)}</span>
      </span>
    );
  };

  return (
    <div className="fixed bottom-10 right-10 z-40 hidden w-64 tui-border p-4 md:block pointer-events-none select-none">
      <div className="mb-2 border-b border-primary/20 pb-1 flex justify-between items-center">
        <span className="text-[10px] uppercase tracking-widest text-primary">System Monitor v1.0</span>
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
      </div>
      
      <div className="space-y-3 font-mono text-[11px]">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">CPU [</span>
          {renderBar(stats.cpu, "text-cyan-400")}
          <span className="text-muted-foreground">] {stats.cpu}%</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">MEM [</span>
          {renderBar(stats.ram, "text-emerald-400")}
          <span className="text-muted-foreground">] {stats.ram}%</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">COF [</span>
          {renderBar(stats.coffee, "text-amber-400")}
          <span className="text-muted-foreground">] {stats.coffee.toFixed(0)}%</span>
        </div>
      </div>

      <div className="mt-4 pt-2 border-t border-primary/10 grid grid-cols-2 gap-2 text-[9px] text-muted-foreground uppercase tracking-tight">
        <div>UPTIME: {stats.uptime}</div>
        <div>TEMP: 42°C</div>
        <div>LOAD: 0.85</div>
        <div>JOBS: 4</div>
      </div>
    </div>
  );
};

export default SystemMonitor;
