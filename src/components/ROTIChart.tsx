import { useMemo } from "react";
import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { HoursHistory, TIME_MULTIPLIER, VA_HOURLY_RATE } from "@/lib/walletTypes";
import { formatCurrency } from "@/lib/walletService";

interface ROTIChartProps {
  history: HoursHistory[];
}

export const ROTIChart = ({ history }: ROTIChartProps) => {
  const chartData = useMemo(() => {
    if (!history || history.length === 0) {
      // Generate placeholder data for last 6 months
      const months = [];
      const now = new Date();
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        months.push({
          month: date.toLocaleDateString('en-US', { month: 'short' }),
          monthYear: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
          hoursUsed: 0,
          investment: 0,
          valueDelivered: 0,
          roti: 0,
        });
      }
      return months;
    }

    return history
      .sort((a, b) => a.month_year.localeCompare(b.month_year))
      .slice(-6) // Last 6 months
      .map((entry) => {
        const [year, monthNum] = entry.month_year.split('-');
        const date = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
        // Conservative ROTI: hours saved × VA rate
        const hoursSaved = entry.hours_used * TIME_MULTIPLIER;
        const valueDelivered = hoursSaved * VA_HOURLY_RATE;
        
        return {
          month: date.toLocaleDateString('en-US', { month: 'short' }),
          monthYear: entry.month_year,
          hoursUsed: entry.hours_used,
          hoursSaved: hoursSaved,
          investment: entry.plan_price,
          valueDelivered: valueDelivered,
          roti: entry.plan_price > 0 ? Math.round((valueDelivered / entry.plan_price) * 100) / 100 : 0,
        };
      });
  }, [history]);

  const totalValueDelivered = chartData.reduce((sum, d) => sum + d.valueDelivered, 0);
  const totalInvestment = chartData.reduce((sum, d) => sum + d.investment, 0);
  const hasData = history && history.length > 0;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-sm mb-2">{label}</p>
          <div className="space-y-1 text-xs">
            <p className="text-muted-foreground">
              Hours Used: <span className="text-foreground font-medium">{data.hoursUsed}</span>
            </p>
            <p className="text-muted-foreground">
              Hours Saved: <span className="text-foreground font-medium">{Math.round(data.hoursSaved)}</span>
            </p>
            <p className="text-muted-foreground">
              Investment: <span className="text-foreground font-medium">{formatCurrency(data.investment)}</span>
            </p>
            <p className="text-muted-foreground">
              Value Delivered: <span className="text-accent font-bold">{formatCurrency(data.valueDelivered)}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="border-accent/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-accent" />
          ROTI Growth Over Time
        </CardTitle>
        {hasData && (
          <p className="text-xs text-muted-foreground">
            Total value delivered: <span className="font-semibold text-accent">{formatCurrency(totalValueDelivered)}</span>
            {totalInvestment > 0 && (
              <> from {formatCurrency(totalInvestment)} invested</>
            )}
          </p>
        )}
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <div className="h-[180px] flex items-center justify-center text-center">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">No historical data yet</p>
              <p className="text-xs text-muted-foreground">
                Your ROTI growth will appear here as you use hours over time
              </p>
            </div>
          </div>
        ) : (
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 11 }} 
                  tickLine={false}
                  axisLine={false}
                  className="text-muted-foreground"
                />
                <YAxis 
                  tick={{ fontSize: 10 }} 
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => value >= 1000 ? `$${(value / 1000).toFixed(0)}k` : `$${value}`}
                  className="text-muted-foreground"
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="valueDelivered"
                  stroke="hsl(var(--accent))"
                  strokeWidth={2}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};