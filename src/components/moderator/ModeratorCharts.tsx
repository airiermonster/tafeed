import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { 
  CheckCircle, 
  Clock, 
  FileText, 
  AlertTriangle, 
  BarChart3,
  PieChart,
  MapPin,
  Tag
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FeedbackSubmission } from "@/types/feedback";
import { differenceInDays, format, subDays } from "date-fns";
import { 
  Area, 
  AreaChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  PieChart as RechartPieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar,
  CartesianGrid,
  TooltipProps
} from "recharts";
import { useAuth } from "@/hooks/useAuth";

interface ModeratorChartsProps {
  moderatorRegion?: string;
}

interface StatsData {
  totalFeedback: number;
  feedbackByStatus: {
    pending: number;
    reviewing: number;
    resolved: number;
    rejected: number;
  };
  feedbackByCategory: {
    name: string;
    count: number;
  }[];
  feedbackByDistrict: {
    name: string;
    count: number;
  }[];
  feedbackTrends: {
    date: string;
    pending: number;
    reviewing: number;
    resolved: number;
    rejected: number;
  }[];
}

// Colors for status
const STATUS_COLORS = {
  pending: "#f59e0b",
  reviewing: "#3b82f6",
  resolved: "#10b981",
  rejected: "#ef4444",
};

export function ModeratorCharts({ moderatorRegion }: ModeratorChartsProps) {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState<StatsData>({
    totalFeedback: 0,
    feedbackByStatus: {
      pending: 0,
      reviewing: 0,
      resolved: 0,
      rejected: 0,
    },
    feedbackByCategory: [],
    feedbackByDistrict: [],
    feedbackTrends: [],
  });

  // Get region from props or from user profile
  const region = moderatorRegion || profile?.region || "All Regions";

  useEffect(() => {
    fetchData();
  }, [region]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch feedback data
      let query = supabase.from("feedback").select("*");
      
      // Add region filter if specific region provided
      if (region && region !== "All Regions") {
        query = query.eq("region", region);
      }
      
      const { data: feedbackData, error } = await query;
      
      if (error) throw error;
      
      if (feedbackData) {
        // Process stats
        processData(feedbackData as unknown as FeedbackSubmission[]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const processData = (feedbackData: FeedbackSubmission[]) => {
    // Calculate status counts
    const statusCounts = {
      pending: 0,
      reviewing: 0,
      resolved: 0,
      rejected: 0,
    };
    
    feedbackData.forEach(feedback => {
      if (feedback.status in statusCounts) {
        statusCounts[feedback.status as keyof typeof statusCounts]++;
      }
    });
    
    // Process by category
    const categoryMap = new Map<string, number>();
    feedbackData.forEach(feedback => {
      const category = feedback.category || "Unknown";
      categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
    });
    
    const feedbackByCategory = Array.from(categoryMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Top 5 categories
    
    // Process by district
    const districtMap = new Map<string, number>();
    feedbackData.forEach(feedback => {
      const district = feedback.district || "Unknown";
      districtMap.set(district, (districtMap.get(district) || 0) + 1);
    });
    
    const feedbackByDistrict = Array.from(districtMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Top 5 districts
    
    // Process trends over the last 14 days
    const today = new Date();
    const twoWeeksAgo = subDays(today, 14);
    
    // Initialize data for each day
    const dailyData: Record<string, {
      pending: number;
      reviewing: number;
      resolved: number;
      rejected: number;
    }> = {};
    
    // Create empty entries for each day
    for (let i = 0; i < 14; i++) {
      const date = format(subDays(today, i), 'yyyy-MM-dd');
      dailyData[date] = {
        pending: 0,
        reviewing: 0,
        resolved: 0,
        rejected: 0,
      };
    }
    
    // Fill in data
    feedbackData.forEach(feedback => {
      const feedbackDate = new Date(feedback.created_at);
      const daysDiff = differenceInDays(today, feedbackDate);
      
      if (daysDiff <= 14) {
        const dateKey = format(feedbackDate, 'yyyy-MM-dd');
        if (dateKey in dailyData && feedback.status in dailyData[dateKey]) {
          dailyData[dateKey][feedback.status as keyof typeof statusCounts]++;
        }
      }
    });
    
    // Convert to array for chart
    const feedbackTrends = Object.entries(dailyData)
      .map(([date, counts]) => ({
        date: format(new Date(date), 'MMM dd'),
        ...counts,
      }))
      .reverse();
    
    // Update state
    setStatsData({
      totalFeedback: feedbackData.length,
      feedbackByStatus: statusCounts,
      feedbackByCategory,
      feedbackByDistrict,
      feedbackTrends,
    });
  };

  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">{label}</p>
          {payload.map((entry, index) => (
            <div key={`item-${index}`} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span>{entry.name}: {entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="flex flex-col items-center p-6">
            <FileText className="h-8 w-8 text-muted-foreground mb-2" />
            <h3 className="text-2xl font-bold">{statsData.totalFeedback}</h3>
            <p className="text-muted-foreground">Total Feedback</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex flex-col items-center p-6">
            <Clock className="h-8 w-8 text-yellow-500 mb-2" />
            <h3 className="text-2xl font-bold">{statsData.feedbackByStatus.pending}</h3>
            <p className="text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex flex-col items-center p-6">
            <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
            <h3 className="text-2xl font-bold">{statsData.feedbackByStatus.resolved}</h3>
            <p className="text-muted-foreground">Resolved</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex flex-col items-center p-6">
            <AlertTriangle className="h-8 w-8 text-red-500 mb-2" />
            <h3 className="text-2xl font-bold">{statsData.feedbackByStatus.rejected}</h3>
            <p className="text-muted-foreground">Rejected</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feedback Trends */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              <span>Feedback Trends</span>
            </CardTitle>
            <CardDescription>
              Feedback submissions over the last 14 days in {region !== "All Regions" ? region : "all regions"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={statsData.feedbackTrends}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#ccc" opacity={0.2} />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="pending"
                      stackId="1"
                      name="Pending"
                      stroke={STATUS_COLORS.pending}
                      fill={STATUS_COLORS.pending}
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="reviewing"
                      stackId="1"
                      name="Reviewing"
                      stroke={STATUS_COLORS.reviewing}
                      fill={STATUS_COLORS.reviewing}
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="resolved"
                      stackId="1"
                      name="Resolved"
                      stroke={STATUS_COLORS.resolved}
                      fill={STATUS_COLORS.resolved}
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="rejected"
                      stackId="1"
                      name="Rejected"
                      stroke={STATUS_COLORS.rejected}
                      fill={STATUS_COLORS.rejected}
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Feedback by Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              <span>Feedback by Status</span>
            </CardTitle>
            <CardDescription>
              Distribution of feedback by current status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <RechartPieChart>
                    <Pie
                      data={[
                        { name: "Pending", value: statsData.feedbackByStatus.pending },
                        { name: "Reviewing", value: statsData.feedbackByStatus.reviewing },
                        { name: "Resolved", value: statsData.feedbackByStatus.resolved },
                        { name: "Rejected", value: statsData.feedbackByStatus.rejected },
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      nameKey="name"
                      labelLine={false}
                      label={({ name, percent }) => 
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      <Cell fill={STATUS_COLORS.pending} />
                      <Cell fill={STATUS_COLORS.reviewing} />
                      <Cell fill={STATUS_COLORS.resolved} />
                      <Cell fill={STATUS_COLORS.rejected} />
                    </Pie>
                    <Tooltip />
                  </RechartPieChart>
                </ResponsiveContainer>
              )}
            </div>
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500">Pending</Badge>
              <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500">Reviewing</Badge>
              <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500">Resolved</Badge>
              <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500">Rejected</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Feedback by Category */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              <span>Top Categories</span>
            </CardTitle>
            <CardDescription>
              Most common feedback categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : statsData.feedbackByCategory.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <p className="text-muted-foreground">No category data available</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={statsData.feedbackByCategory}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Feedback by District */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <span>Top Districts</span>
            </CardTitle>
            <CardDescription>
              Districts with the most feedback
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : statsData.feedbackByDistrict.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <p className="text-muted-foreground">No district data available</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={statsData.feedbackByDistrict}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 