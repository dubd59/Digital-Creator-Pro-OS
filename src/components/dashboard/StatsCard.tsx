import { Card, CardContent } from '../ui/Card';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  change?: number;
  icon: React.ReactNode;
  color: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  icon,
  color,
}) => {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">{title}</p>
            <h4 className="text-2xl font-bold mt-1 text-neutral-900 dark:text-white">{value}</h4>
            
            {change !== undefined && (
              <div className="flex items-center mt-1">
                <div 
                  className={`flex items-center text-xs font-medium ${
                    isPositive ? 'text-green-500' : isNegative ? 'text-red-500' : 'text-neutral-500'
                  }`}
                >
                  {isPositive ? (
                    <ArrowUp size={12} className="mr-1" />
                  ) : isNegative ? (
                    <ArrowDown size={12} className="mr-1" />
                  ) : null}
                  <span>{Math.abs(change)}%</span>
                </div>
                <span className="text-xs text-neutral-500 dark:text-neutral-400 ml-1">vs last month</span>
              </div>
            )}
          </div>
          
          <div 
            className="p-3 rounded-lg" 
            style={{ backgroundColor: `${color}20` }}
          >
            <div style={{ color }}>
              {icon}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};