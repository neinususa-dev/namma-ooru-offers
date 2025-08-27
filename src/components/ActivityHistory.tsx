import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, TrendingUp, TrendingDown, Gift, UserPlus, QrCode, Calendar } from 'lucide-react';
import { RewardActivity } from '@/hooks/useRewards';

interface ActivityHistoryProps {
  activities: RewardActivity[];
  loading?: boolean;
}

export const ActivityHistory: React.FC<ActivityHistoryProps> = ({ 
  activities, 
  loading = false 
}) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'registration_bonus':
        return <UserPlus className="w-4 h-4" />;
      case 'referral_bonus':
        return <UserPlus className="w-4 h-4" />;
      case 'qr_scan':
        return <QrCode className="w-4 h-4" />;
      case 'offer_redeem':
        return <Gift className="w-4 h-4" />;
      case 'points_redeem':
        return <Gift className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string, points: number) => {
    if (points > 0) return 'text-green-600';
    return 'text-red-600';
  };

  const getActivityBadgeVariant = (type: string, points: number): "default" | "secondary" | "destructive" | "outline" => {
    if (points > 0) return 'default';
    return 'destructive';
  };

  const formatActivityType = (type: string) => {
    switch (type) {
      case 'registration_bonus':
        return 'Welcome Bonus';
      case 'referral_bonus':
        return 'Referral Bonus';
      case 'qr_scan':
        return 'QR Scan';
      case 'offer_redeem':
        return 'Offer Redeemed';
      case 'points_redeem':
        return 'Points Redeemed';
      default:
        return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 border rounded-lg animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="space-y-1">
                    <div className="w-24 h-4 bg-gray-200 rounded"></div>
                    <div className="w-16 h-3 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div className="w-16 h-6 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>Your points activity will appear here</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Activity className="w-12 h-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium text-muted-foreground">No activity yet</p>
          <p className="text-sm text-muted-foreground">Start earning points to see your activity history!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Recent Activity
        </CardTitle>
        <CardDescription>Your latest points transactions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.map((activity) => (
            <div 
              key={activity.id} 
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full bg-muted ${getActivityColor(activity.activity_type, activity.points)}`}>
                  {getActivityIcon(activity.activity_type)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">
                      {formatActivityType(activity.activity_type)}
                    </span>
                    <Badge 
                      variant={getActivityBadgeVariant(activity.activity_type, activity.points)}
                      className="text-xs"
                    >
                      {activity.points > 0 ? '+' : ''}{activity.points} pts
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {activity.description}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {new Date(activity.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`flex items-center gap-1 ${getActivityColor(activity.activity_type, activity.points)}`}>
                  {activity.points > 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span className="font-bold">
                    {activity.points > 0 ? '+' : ''}{activity.points}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};