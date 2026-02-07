import { useMemo } from "react";
import { Clock, Infinity, BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { WalletData, HoursHistory, ProjectRequest } from "@/lib/walletTypes";
import {
  formatCurrency,
  getPercentageUsed,
  getTimeUntilReset,
  isUnlimitedPlan,
} from "@/lib/walletService";

// Department display mapping
const CATEGORY_META: Record<string, { label: string; color: string }> = {
  "sales-marketing": { label: "Sales & Marketing", color: "hsl(25, 95%, 53%)" },
  "product-dev": { label: "Product & Dev", color: "hsl(189, 94%, 43%)" },
  operations: { label: "Operations", color: "hsl(262, 52%, 47%)" },
  "finance-admin": { label: "Finance & Admin", color: "hsl(142, 71%, 45%)" },
  "strategy-analytics": { label: "Strategy", color: "hsl(38, 92%, 50%)" },
  "people-culture": { label: "People & Culture", color: "hsl(340, 75%, 55%)" },
  general: { label: "General", color: "hsl(215, 28%, 50%)" },
  other: { label: "Other", color: "hsl(215, 19%, 65%)" },
};

interface HoursBreakdownProps {
  data: WalletData;
}

export const HoursBreakdown = ({ data }: HoursBreakdownProps) => {
  const unlimited = isUnlimitedPlan(data.hours_included);
  const percentageUsed = unlimited ? 0 : getPercentageUsed(data.hours_used, data.hours_included);

  // Build category distribution from project requests
  const categoryData = useMemo(() => {
    const requests = data.project_requests || [];
    if (requests.length === 0) return [];

    const counts: Record<string, number> = {};
    requests.forEach((req) => {
      const cat = req.form_category || "other";
      counts[cat] = (counts[cat] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([key, count]) => ({
        name: CATEGORY_META[key]?.label || key,
        value: count,
        color: CATEGORY_META[key]?.color || "hsl(215, 19%, 65%)",
        slug: key,
      }))
      .sort((a, b) => b.value - a.value);
  }, [data.project_requests]);

  const totalRequests = categoryData.reduce((sum, d) => sum + d.value, 0);

  // Monthly hours trend from history
  const monthlyData = useMemo(() => {
    const history = data.hours_history || [];
    if (history.length === 0) return [];

    return history
      .sort((a, b) => a.month_year.localeCompare(b.month_year))
      .slice(-6)
      .map((entry) => {
        const [year, monthNum] = entry.month_year.split("-");
        const date = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
        return {
          month: date.toLocaleDateString("en-US", { month: "short" }),
          hours: entry.hours_used,
          included: entry.hours_included,
        };
      });
  }, [data.hours_history]);

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      const pct = totalRequests > 0 ? Math.round((d.value / totalRequests) * 100) : 0;
      return (
        <div className="bg-popover border border-border rounded-lg p-2.5 shadow-lg text-xs">
          <p className="font-semibold">{d.name}</p>
          <p className="text-muted-foreground">
            {d.value} request{d.value !== 1 ? "s" : ""} ({pct}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-2.5 shadow-lg text-xs">
          <p className="font-semibold mb-1">{label}</p>
          <p className="text-muted-foreground">
            Hours Used: <span className="text-foreground font-medium">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Hours Overview */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              {unlimited ? <Infinity className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
              Hours Overview
            </h3>
            <span className="text-xs text-muted-foreground">
              {getTimeUntilReset(data.billing_cycle_end)}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 rounded-lg bg-primary/5">
              <p className="text-2xl font-bold">{data.hours_used}</p>
              <p className="text-[10px] text-muted-foreground">Used</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-accent/10">
              <p className="text-2xl font-bold text-accent">
                {unlimited ? "∞" : data.hours_remaining}
              </p>
              <p className="text-[10px] text-muted-foreground">Remaining</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <p className="text-2xl font-bold">
                {unlimited ? "∞" : data.hours_included}
              </p>
              <p className="text-[10px] text-muted-foreground">Included</p>
            </div>
          </div>

          {!unlimited && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{Math.round(percentageUsed)}% used</span>
                <span>{data.hours_remaining} hrs left</span>
              </div>
              <Progress value={percentageUsed} className="h-2" />
              {data.overage_rate > 0 && percentageUsed >= 80 && (
                <p className="text-[10px] text-warning">
                  Overage rate: {formatCurrency(data.overage_rate)}/hr after plan hours
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Request Distribution by Department */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Request Distribution
          </h3>
          {categoryData.length > 0 ? (
            <div className="flex gap-4 items-center">
              {/* Pie Chart */}
              <div className="w-[140px] h-[140px] flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={65}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend */}
              <div className="flex-1 space-y-1.5">
                {categoryData.map((cat) => {
                  const pct = totalRequests > 0 ? Math.round((cat.value / totalRequests) * 100) : 0;
                  return (
                    <div key={cat.slug} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: cat.color }}
                        />
                        <span className="text-foreground truncate">{cat.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                          {cat.value}
                        </Badge>
                        <span className="text-muted-foreground w-8 text-right">{pct}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="h-[120px] flex items-center justify-center text-center">
              <p className="text-sm text-muted-foreground">
                No requests yet — submit your first project to see the breakdown
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Monthly Hours Trend */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Monthly Hours Trend
          </h3>
          {monthlyData.length > 0 ? (
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip content={<CustomBarTooltip />} />
                  <Bar
                    dataKey="hours"
                    fill="hsl(25, 95%, 53%)"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[120px] flex items-center justify-center text-center">
              <p className="text-sm text-muted-foreground">
                Monthly trend data will appear as usage builds over time
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
