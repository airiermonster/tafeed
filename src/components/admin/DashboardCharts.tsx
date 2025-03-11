import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { FeedbackSubmission } from "@/types/feedback";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, Legend 
} from "recharts";
import { format, subDays, differenceInDays } from "date-fns";

// Custom colors for charts
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];
const STATUS_COLORS = {
  pending: "#f59e0b",
  reviewing: "#3b82f6",
  resolved: "#10b981",
  rejected: "#ef4444"
};
const USER_ROLE_COLORS = {
  "Regular Users": "#4f46e5", // indigo
  "Moderators": "#0891b2",    // cyan
  "Administrators": "#c2410c" // amber
};

interface StatsData {
  totalFeedback: number;
  totalUsers: number;
  feedbackByCategory: { name: string; value: number }[];
  feedbackByStatus: { name: string; value: number }[];
  feedbackByRegion: { name: string; value: number }[];
  feedbackTrend: { date: string; count: number }[];
  categoriesCount: number;
  regionsCount: number;
  userRoleData: { name: string; value: number }[];
}

export function DashboardCharts() {
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState<StatsData>({
    totalFeedback: 0,
    totalUsers: 0,
    feedbackByCategory: [],
    feedbackByStatus: [],
    feedbackByRegion: [],
    feedbackTrend: [],
    categoriesCount: 0,
    regionsCount: 0,
    userRoleData: []
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Get feedback data
      const { data: feedbackData, error: feedbackError } = await supabase
        .from("feedback")
        .select("*");
      
      if (feedbackError) throw feedbackError;

      // Get user count - fetch all profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id");
      
      if (profilesError) throw profilesError;

      // Calculate user counts by role
      const { data: adminCount, error: adminError } = await supabase
        .from("user_roles")
        .select("id")
        .eq("role", "admin");
      
      if (adminError) throw adminError;

      const { data: moderatorCount, error: moderatorError } = await supabase
        .from("user_roles")
        .select("id")
        .eq("role", "moderator");
      
      if (moderatorError) throw moderatorError;

      // Get categories count
      const { data: categoriesData, error: categoriesError } = await supabase
        .from("feedback_categories")
        .select("id");
      
      if (categoriesError) throw categoriesError;

      // Process feedback by category
      const categoryCountMap = new Map<string, number>();
      feedbackData.forEach((feedback: FeedbackSubmission) => {
        const category = feedback.category;
        categoryCountMap.set(category, (categoryCountMap.get(category) || 0) + 1);
      });

      const feedbackByCategory = Array.from(categoryCountMap.entries()).map(([name, value]) => ({
        name,
        value
      })).sort((a, b) => b.value - a.value);

      // Process feedback by status
      const statusCountMap = new Map<string, number>();
      feedbackData.forEach((feedback: FeedbackSubmission) => {
        const status = feedback.status;
        statusCountMap.set(status, (statusCountMap.get(status) || 0) + 1);
      });

      const feedbackByStatus = Array.from(statusCountMap.entries()).map(([name, value]) => ({
        name,
        value
      }));

      // Process feedback by region
      const regionCountMap = new Map<string, number>();
      feedbackData.forEach((feedback: FeedbackSubmission) => {
        const region = feedback.region;
        regionCountMap.set(region, (regionCountMap.get(region) || 0) + 1);
      });

      const feedbackByRegion = Array.from(regionCountMap.entries())
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5); // Top 5 regions

      // Process feedback trend (last 14 days)
      const dateMap = new Map<string, number>();
      
      // Initialize the last 14 days with 0 counts
      for (let i = 13; i >= 0; i--) {
        const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
        dateMap.set(date, 0);
      }
      
      // Count feedback submissions by date
      feedbackData.forEach((feedback: FeedbackSubmission) => {
        const submissionDate = format(new Date(feedback.created_at), 'yyyy-MM-dd');
        const daysAgo = differenceInDays(new Date(), new Date(submissionDate));
        
        if (daysAgo <= 13) {
          dateMap.set(submissionDate, (dateMap.get(submissionDate) || 0) + 1);
        }
      });
      
      const feedbackTrend = Array.from(dateMap.entries())
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      // Calculate user role distribution for pie chart
      const userRoleData = [
        { name: "Regular Users", value: profilesData.length - (adminCount.length + moderatorCount.length) },
        { name: "Moderators", value: moderatorCount.length },
        { name: "Administrators", value: adminCount.length }
      ];

      setStatsData({
        totalFeedback: feedbackData.length,
        totalUsers: profilesData.length,
        feedbackByCategory,
        feedbackByStatus,
        feedbackByRegion,
        feedbackTrend,
        categoriesCount: categoriesData.length,
        regionsCount: regionCountMap.size,
        userRoleData
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Feedback"
          value={statsData.totalFeedback}
          description="Total feedback submissions"
          loading={loading}
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>}
        />
        
        <MetricCard
          title="Total Users"
          value={statsData.totalUsers}
          description="Registered platform users"
          loading={loading}
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>}
        />
        
        <MetricCard
          title="Categories"
          value={statsData.categoriesCount}
          description="Feedback categories"
          loading={loading}
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>}
        />
        
        <MetricCard
          title="Regions"
          value={statsData.regionsCount}
          description="Regions with feedback"
          loading={loading}
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Feedback Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Skeleton className="h-64 w-full" />
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statsData.feedbackByStatus}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {statsData.feedbackByStatus.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={STATUS_COLORS[entry.name as keyof typeof STATUS_COLORS] || COLORS[index % COLORS.length]} 
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
            <div className="flex justify-center mt-4 flex-wrap gap-2">
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500">Pending</Badge>
              <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500">Reviewing</Badge>
              <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500">Resolved</Badge>
              <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500">Rejected</Badge>
            </div>
          </CardContent>
        </Card>

        {/* User Role Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">User Role Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Skeleton className="h-64 w-full" />
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statsData.userRoleData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value, percent }) => 
                        `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                      }
                    >
                      {statsData.userRoleData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={USER_ROLE_COLORS[entry.name as keyof typeof USER_ROLE_COLORS] || COLORS[index % COLORS.length]} 
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
            <div className="flex justify-center mt-4 flex-wrap gap-2">
              <Badge variant="outline" className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-500">Regular Users</Badge>
              <Badge variant="outline" className="bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-500">Moderators</Badge>
              <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-500">Administrators</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Feedback by Category */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Feedback by Category</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Skeleton className="h-64 w-full" />
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statsData.feedbackByCategory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" name="Feedback Count">
                      {statsData.feedbackByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Feedback Trend */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Feedback Trend (Last 14 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Skeleton className="h-64 w-full" />
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={statsData.feedbackTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => format(new Date(value), 'MMM dd')}
                    />
                    <YAxis />
                    <Tooltip labelFormatter={(value) => format(new Date(value), 'MMM dd, yyyy')} />
                    <Line type="monotone" dataKey="count" stroke="#8884d8" name="Submissions" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Regions */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Top Regions</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Skeleton className="h-64 w-full" />
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statsData.feedbackByRegion} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={100} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#82ca9d" name="Feedback Count">
                      {statsData.feedbackByRegion.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: number;
  description: string;
  loading: boolean;
  icon: React.ReactNode;
}

function MetricCard({ title, value, description, loading, icon }: MetricCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            {loading ? (
              <Skeleton className="h-9 w-20 mt-1" />
            ) : (
              <h3 className="text-3xl font-bold mt-1">{value.toLocaleString()}</h3>
            )}
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          </div>
          <div>{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
} 