import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Send, Clock, Users, CheckCircle, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

interface DropStatusTimelineProps {
  drop: {
    id: string;
    amount: number;
    message: string;
    status: string;
    created_at: string;
  };
}

const DropStatusTimeline = ({ drop }: DropStatusTimelineProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const steps = [
    {
      id: 'sent',
      title: 'Drop Sent',
      description: 'Your karma is in the pool',
      icon: Send,
      status: 'completed',
      color: 'text-brand-green'
    },
    {
      id: 'matching',
      title: 'Matching',
      description: 'Finding the perfect recipient',
      icon: Users,
      status: drop.status === 'pending' ? 'current' : drop.status === 'matching' || drop.status === 'paid' ? 'completed' : 'pending',
      color: 'text-brand-yellow'
    },
    {
      id: 'complete',
      title: 'Match Complete',
      description: 'Recipient found and notified',
      icon: CheckCircle,
      status: drop.status === 'paid' ? 'completed' : 'pending',
      color: 'text-brand-pink'
    },
    {
      id: 'payout',
      title: 'Payout Confirmed',
      description: 'Money sent to recipient',
      icon: DollarSign,
      status: drop.status === 'paid' ? 'completed' : 'pending',
      color: 'text-primary'
    }
  ];

  const getCurrentStepIndex = () => {
    switch (drop.status) {
      case 'pending': return 1;
      case 'matching': return 2;
      case 'paid': return 3;
      default: return 0;
    }
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <Card className="bg-card/20 backdrop-blur-sm border border-primary/30 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold">Drop Status</h3>
            <p className="text-sm text-muted-foreground">
              ₹{drop.amount} • {drop.message}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-muted-foreground hover:text-foreground"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            View Details
          </Button>
        </div>

        {/* Timeline */}
        <div className="space-y-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;
            
            return (
              <div key={step.id} className="flex items-start gap-4">
                {/* Step Icon */}
                <div className={cn(
                  "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                  isCompleted 
                    ? "bg-primary/20 ring-2 ring-primary/50" 
                    : "bg-muted/30 ring-1 ring-border/50"
                )}>
                  <Icon className={cn(
                    "w-5 h-5 transition-all duration-300",
                    isCompleted ? step.color : "text-muted-foreground",
                    isCurrent && "animate-pulse"
                  )} />
                </div>

                {/* Step Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className={cn(
                      "font-semibold transition-colors",
                      isCompleted ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {step.title}
                    </h4>
                    {isCurrent && (
                      <div className="flex items-center gap-1 text-xs text-primary">
                        <Clock className="w-3 h-3 animate-pulse" />
                        <span>In Progress</span>
                      </div>
                    )}
                  </div>
                  <p className={cn(
                    "text-sm transition-colors",
                    isCompleted ? "text-foreground/80" : "text-muted-foreground"
                  )}>
                    {step.description}
                  </p>
                </div>

                {/* Connection Line */}
                {index < steps.length - 1 && (
                  <div className="absolute left-5 top-10 w-0.5 h-8 bg-gradient-to-b from-primary/50 to-muted/30" />
                )}
              </div>
            );
          })}
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="mt-6 pt-6 border-t border-border/30 space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Drop ID:</span>
                <p className="font-mono text-xs">{drop.id.slice(0, 8)}...</p>
              </div>
              <div>
                <span className="text-muted-foreground">Created:</span>
                <p>{new Date(drop.created_at).toLocaleDateString()}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Amount:</span>
                <p className="font-bold text-primary">₹{drop.amount}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Status:</span>
                <p className="capitalize">{drop.status}</p>
              </div>
            </div>
            
            <div className="bg-muted/20 rounded-lg p-4">
              <h5 className="font-semibold mb-2">Message</h5>
              <p className="text-sm text-foreground/80">{drop.message}</p>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>Progress</span>
            <span>{Math.round(((currentStepIndex + 1) / steps.length) * 100)}%</span>
          </div>
          <div className="w-full bg-muted/30 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-primary to-brand-pink h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DropStatusTimeline; 