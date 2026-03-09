'use client';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export default function DashboardCharts({ stats }) {
  if (!stats) return null;

  // 1. User Status Processing
  const userStatusData = [
    { name: 'Active', value: stats.users.active },
    { name: 'Inactive', value: stats.users.inActive }
  ];
  const USER_COLORS = ['#10b981', '#ef4444']; // Green, Red

  // 2. Today's Transaction Amount Processing
  const amountData = [
    {
      name: "Today's Volume",
      CREDIT: stats.transactionsToday.CREDIT.totalAmount,
      DEBIT: stats.transactionsToday.DEBIT.totalAmount,
    }
  ];

  // 3. Transaction Count Processing
  const countData = [
    {
      name: "Today's Count",
      CREDIT: stats.transactionsToday.CREDIT.count,
      DEBIT: stats.transactionsToday.DEBIT.count,
    }
  ];

  // Dark Theme chart configurations
  const CHART_THEME = {
    textColor: '#cbd5e1', // slate-300
    gridColor: '#334155', // slate-700
    tooltipBg: '#1e293b', // slate-800
    tooltipBorder: '#475569', // slate-600
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: CHART_THEME.tooltipBg,
          border: `1px solid ${CHART_THEME.tooltipBorder}`,
          padding: '10px',
          color: '#f8fafc',
          borderRadius: '6px'
        }}>
          <p className="font-semibold mb-2">{label || payload[0].name}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.name === 'CREDIT' || entry.name === 'DEBIT' ? '$' : ''}{entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mt-8 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart 1: User Status (Pie Chart) */}
        <div className="bg-slate-800 border border-slate-700 shadow-lg rounded-lg p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4 text-center">User Status</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {userStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={USER_COLORS[index % USER_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ color: CHART_THEME.textColor }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Today's Transaction Amount (Bar Chart) */}
        <div className="bg-slate-800 border border-slate-700 shadow-lg rounded-lg p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4 text-center">Transaction Amounts (Today)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={amountData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.gridColor} />
                <XAxis dataKey="name" stroke={CHART_THEME.textColor} />
                <YAxis stroke={CHART_THEME.textColor} tickFormatter={(value) => `$${value}`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ color: CHART_THEME.textColor }} />
                <Bar dataKey="CREDIT" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="DEBIT" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Transaction Count (Bar Chart) */}
        <div className="bg-slate-800 border border-slate-700 shadow-lg rounded-lg p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4 text-center">Transaction Count (Today)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={countData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.gridColor} />
                <XAxis dataKey="name" stroke={CHART_THEME.textColor} />
                <YAxis stroke={CHART_THEME.textColor} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ color: CHART_THEME.textColor }} />
                <Bar dataKey="CREDIT" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="DEBIT" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
