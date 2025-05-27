import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/Card';
import { Button } from '../ui/Button';
import { ArrowRight } from 'lucide-react';

interface ToolCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  onClick: () => void;
}

export const ToolCard: React.FC<ToolCardProps> = ({
  title,
  description,
  icon,
  color,
  onClick,
}) => {
  return (
    <Card 
      className="h-full flex flex-col cursor-pointer hover:transform hover:-translate-y-1 transition-all"
      onClick={onClick}
    >
      <CardHeader className="flex items-start">
        <div 
          className="p-3 rounded-lg mb-3" 
          style={{ backgroundColor: `${color}20` }}
        >
          <div style={{ color }}>
            {icon}
          </div>
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {/* Additional content can be added here */}
      </CardContent>
      <CardFooter>
        <Button 
          variant="ghost" 
          className="ml-auto group" 
          icon={<ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
        >
          Open
        </Button>
      </CardFooter>
    </Card>
  );
};