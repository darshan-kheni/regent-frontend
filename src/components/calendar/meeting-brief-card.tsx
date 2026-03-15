import { format } from 'date-fns'
import type { MeetingBrief } from '@/types/calendar'

interface MeetingBriefCardProps {
  brief: MeetingBrief
}

export function MeetingBriefCard({ brief }: MeetingBriefCardProps) {
  return (
    <div className="border border-neutral-200 dark:border-neutral-800 p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-serif text-sm font-medium">Meeting Prep</h3>
        <span className="text-xs text-neutral-400">
          {format(new Date(brief.generated_at), 'h:mm a')}
        </span>
      </div>
      <div className="text-sm whitespace-pre-line text-neutral-700 dark:text-neutral-300">
        {brief.brief_text}
      </div>
      {brief.attendee_context.length > 0 && (
        <div className="mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-800">
          <p className="text-xs text-neutral-500 mb-1">Attendees</p>
          <div className="space-y-1">
            {brief.attendee_context.map((ac, i) => (
              <div key={i} className="text-xs">
                <span className="font-medium">{ac.name}</span>
                {ac.company && (
                  <span className="text-neutral-400"> &middot; {ac.company}</span>
                )}
                {ac.interaction_count > 0 && (
                  <span className="text-neutral-400">
                    {' '}
                    &middot; {ac.interaction_count} interactions
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
