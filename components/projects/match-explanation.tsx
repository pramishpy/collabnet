'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Lightbulb, Target, TrendingUp } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface MatchExplanationProps {
  matchScore: number
  matchingSkills: string[]
  requiredSkills: string[]
  userRole: string
  projectType?: string
}

export function MatchExplanation({
  matchScore,
  matchingSkills,
  requiredSkills,
  userRole,
}: MatchExplanationProps) {
  const scorePercentage = Math.round(matchScore * 100)
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-orange-600'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent Match'
    if (score >= 60) return 'Good Match'
    return 'Potential Match'
  }

  const skillMatch = (matchingSkills.length / requiredSkills.length) * 100
  const semanticMatch = scorePercentage - (skillMatch * 0.05 * matchingSkills.length)

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Lightbulb className="h-5 w-5 text-primary" />
          Why This Match?
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Score */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Match Score</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <span className={`text-2xl font-bold ${getScoreColor(scorePercentage)}`}>
                  {scorePercentage}%
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">{getScoreLabel(scorePercentage)}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Score Breakdown */}
        <div className="space-y-3 pt-2 border-t">
          <div className="flex items-start gap-3">
            <Target className="h-4 w-4 mt-0.5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium">Skill Match</p>
              <p className="text-xs text-muted-foreground">
                You have {matchingSkills.length} of {requiredSkills.length} required skills
              </p>
              <div className="flex flex-wrap gap-1 mt-2">
                {matchingSkills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <TrendingUp className="h-4 w-4 mt-0.5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium">Semantic Match</p>
              <p className="text-xs text-muted-foreground">
                Your {userRole === 'developer' ? 'experience' : 'research interests'} align
                {' '}{Math.round(semanticMatch)}% with this project
              </p>
            </div>
          </div>
        </div>

        {/* Missing Skills */}
        {requiredSkills.length > matchingSkills.length && (
          <div className="pt-2 border-t">
            <p className="text-xs font-medium text-muted-foreground mb-2">
              Skills you could learn:
            </p>
            <div className="flex flex-wrap gap-1">
              {requiredSkills
                .filter(skill => !matchingSkills.includes(skill))
                .map((skill) => (
                  <Badge key={skill} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
