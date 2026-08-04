import { SafeImage } from './SafeImage'
import type { WebinarPersonGroup } from '@/lib/utils/formatting'
import { getImageUrl } from '@/lib/utils/formatting'

// Only the first person in a group carries the visible "SPEAKERS" / "MODERATOR"
// heading. Everyone else still renders the heading element — invisible, holding a
// non-breaking space — so the reserved height is identical and every photo in the
// row starts on the same line. A plain " " collapses to a zero-height box, which
// is what used to push people without a heading above their neighbours.
const LABEL_PLACEHOLDER = ' '

export function WebinarPeopleRow({
  groups,
  keyPrefix = '',
}: {
  groups: WebinarPersonGroup[]
  keyPrefix?: string
}) {
  if (!groups.length) return null

  return (
    <div className="flex flex-col items-center gap-10 md:flex-row md:flex-wrap md:items-start md:justify-center md:gap-12">
      {groups.flatMap((group) =>
        group.people.map((person, index) => (
          <div key={`${keyPrefix}${group.role}-${person.id}-${index}`} className="ui-font w-[180px] text-center">
            <h3
              className={`mb-6 text-[15px] font-bold uppercase leading-[1.2] tracking-[0.06em] ${
                group.role === 'moderator' ? 'text-[var(--accent-red)]' : 'text-[#7f1d1d]'
              } ${index === 0 ? '' : 'hidden md:block md:invisible'}`}
            >
              {index === 0 ? group.label : LABEL_PLACEHOLDER}
            </h3>
            <div className="relative mx-auto h-[112px] w-[112px] overflow-hidden rounded-full bg-[#ddd] shadow-[0_8px_20px_rgba(0,0,0,0.1)] md:h-[128px] md:w-[128px]">
              {person.photo ? (
                <SafeImage src={getImageUrl(person.photo)} alt={person.name || group.label} fill sizes="128px" className="object-cover" />
              ) : null}
            </div>
            <div className="mt-3 text-[15px] font-semibold text-[#111]">{person.name}</div>
            {person.role ? <div className="mt-1 text-[13px] leading-[1.45] text-[#6a6a6a]">{person.role}</div> : null}
            {person.secondaryLine ? <div className="text-[13px] leading-[1.45] text-[#6a6a6a]">{person.secondaryLine}</div> : null}
          </div>
        )),
      )}
    </div>
  )
}
