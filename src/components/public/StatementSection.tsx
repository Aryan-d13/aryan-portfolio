import type { SectionConfig } from '../../types/siteConfig';

interface Props { section: SectionConfig; }

export default function StatementSection({ section }: Props) {
  return (
    <section
      className="statement-shell section-frame"
      id={section.id}
      data-section-id={section.sectionId}
      data-signal={section.signal}
      data-proof-level={section.proofLevel}
      data-system-status={section.systemStatus}
    >
      <div className="trace-label" aria-hidden="true">
        section_id: {section.sectionId} / signal: {section.signal} / proof_level: {section.proofLevel} / system_status: {section.systemStatus}
      </div>
      <div className="section-rail">
        <p className="section-kicker">{section.kicker}</p>
        {section.railLabel && <span>{section.railLabel}</span>}
      </div>
      <div className="statement-panel">
        {section.bodyAtmospheric && <p className="statement-text" data-atmospheric="">{section.bodyAtmospheric}</p>}
        {section.bodyDirect && <p className="statement-text" data-direct="">{section.bodyDirect}</p>}
      </div>
    </section>
  );
}
