import { Award } from "lucide-react";

interface Badge {
  id: string;
  name: string;
  icon?: string;
  displayName?: string;
}

interface LeetCodeBadgesProps {
  badges: Badge[];
}

export function LeetCodeBadges({ badges }: LeetCodeBadgesProps) {
  if (!badges || badges.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-aqua flex items-center gap-2">
        <Award className="h-5 w-5" />
        Earned Badges
      </h3>
      
      <div className="flex flex-wrap gap-3">
        {badges.map((badge, index) => (
          <div
            key={badge.id || index}
            className="flex items-center gap-2 px-4 py-2 bg-card border-2 border-aqua/20 rounded-lg hover:border-aqua/40 transition-colors"
            title={badge.displayName || badge.name}
          >
            {badge.icon && (
              <img 
                src={badge.icon} 
                alt={badge.name}
                className="h-6 w-6"
              />
            )}
            <span className="text-sm font-medium text-foreground">
              {badge.displayName || badge.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
