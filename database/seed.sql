-- Cath Lab Academy seed data
-- Run after database/schema.sql

insert into training_tracks (slug, title_en, title_ar, description_en, description_ar, level, duration_weeks, sort_order) values
('recovery-nurse', 'Recovery Nurse', 'ممرض الإفاقة', 'Post-catheterization recovery nursing pathway.', 'مسار تمريض الإفاقة بعد القسطرة.', 'foundation', 4, 1),
('circulating-nurse', 'Circulating Nurse', 'ممرض التداول', 'Cath Lab circulating nursing pathway.', 'مسار تمريض التداول داخل غرفة القسطرة.', 'foundation', 6, 2),
('scrub-nurse-technologist', 'Scrub Nurse / Technologist', 'ممرض التعقيم / أخصائي القسطرة', 'Sterile field and device support pathway.', 'مسار التعقيم وتحضير الأجهزة والمساعدة التقنية.', 'intermediate', 8, 3),
('quality-cpd', 'Quality & CPD', 'الجودة والتعليم المستمر', 'Quality governance and continuous professional development pathway.', 'مسار الجودة وحوكمة الكفاءات والتعليم المستمر.', 'trainer', null, 4)
on conflict (slug) do update set
  title_en = excluded.title_en,
  title_ar = excluded.title_ar,
  description_en = excluded.description_en,
  description_ar = excluded.description_ar,
  level = excluded.level,
  duration_weeks = excluded.duration_weeks,
  sort_order = excluded.sort_order;

insert into courses (track_id, slug, title_en, title_ar, summary_en, summary_ar, target_audience, estimated_hours, level, sort_order)
select id, 'cath-lab-orientation', 'Cath Lab Orientation', 'التهيئة الأساسية للقسطرة القلبية', 'Core safety, lab workflow, roles, terminology, and patient journey.', 'السلامة الأساسية، سير العمل، الأدوار، المصطلحات، ورحلة المريض.', 'All new Cath Lab staff', 6, 'foundation', 1
from training_tracks where slug = 'recovery-nurse'
on conflict (slug) do update set summary_en = excluded.summary_en, summary_ar = excluded.summary_ar;

insert into courses (track_id, slug, title_en, title_ar, summary_en, summary_ar, target_audience, estimated_hours, level, sort_order)
select id, 'recovery-access-site-care', 'Recovery & Access Site Care', 'الإفاقة والعناية بموقع الدخول', 'Post-procedure monitoring, radial/femoral management, complications, and discharge readiness.', 'مراقبة ما بعد الإجراء، إدارة Radial/Femoral، المضاعفات، وجاهزية الخروج.', 'Recovery nurses', 8, 'foundation', 2
from training_tracks where slug = 'recovery-nurse'
on conflict (slug) do update set summary_en = excluded.summary_en, summary_ar = excluded.summary_ar;

insert into courses (track_id, slug, title_en, title_ar, summary_en, summary_ar, target_audience, estimated_hours, level, sort_order)
select id, 'circulating-scrub-essentials', 'Circulating & Scrub Essentials', 'أساسيات Circulating و Scrub', 'Room readiness, sterile field, device verification, documentation, and emergency support.', 'جاهزية الغرفة، الحقل المعقم، التحقق من الأجهزة، التوثيق، ودعم الطوارئ.', 'Cath Lab nurses and technologists', 10, 'intermediate', 3
from training_tracks where slug = 'circulating-nurse'
on conflict (slug) do update set summary_en = excluded.summary_en, summary_ar = excluded.summary_ar;

insert into courses (track_id, slug, title_en, title_ar, summary_en, summary_ar, target_audience, estimated_hours, level, sort_order)
select id, 'competency-cpd-governance', 'Competency & CPD Governance', 'حوكمة الكفاءات والتعليم المستمر', 'Competency matrix, audit readiness, incident learning, and trainer sign-off workflow.', 'مصفوفة الكفاءات، جاهزية التدقيق، التعلم من الحوادث، واعتماد المدرب.', 'Trainers and leaders', 6, 'trainer', 4
from training_tracks where slug = 'quality-cpd'
on conflict (slug) do update set summary_en = excluded.summary_en, summary_ar = excluded.summary_ar;

insert into competencies (course_id, code, title_en, title_ar, description_en, description_ar, required_evidence, sort_order)
select id, 'REC-001', 'Patient identity and allergy verification', 'التحقق من هوية المريض والحساسية', 'Verify patient ID, allergies, consent status, and procedure handover.', 'التحقق من الهوية والحساسية والموافقة وتسليم الحالة.', 'Observed checklist + trainer sign-off', 1
from courses where slug = 'recovery-access-site-care'
on conflict (code) do update set title_en = excluded.title_en, title_ar = excluded.title_ar;

insert into competencies (course_id, code, title_en, title_ar, description_en, description_ar, required_evidence, sort_order)
select id, 'REC-002', 'Access site assessment', 'تقييم موقع الدخول', 'Assess radial/femoral access site, bleeding, hematoma, pain, and distal perfusion.', 'تقييم موقع الدخول Radial/Femoral والنزيف والورم والألم والتروية الطرفية.', 'Observed assessment documentation', 2
from courses where slug = 'recovery-access-site-care'
on conflict (code) do update set title_en = excluded.title_en, title_ar = excluded.title_ar;

insert into competencies (course_id, code, title_en, title_ar, description_en, description_ar, required_evidence, sort_order)
select id, 'ROOM-001', 'Pre-procedure room readiness', 'جاهزية الغرفة قبل الإجراء', 'Confirm emergency cart, device readiness, documentation tools, contrast and radiation safety.', 'التأكد من عربة الطوارئ وجاهزية الأجهزة وأدوات التوثيق وسلامة الصبغة والإشعاع.', 'Room readiness checklist', 1
from courses where slug = 'circulating-scrub-essentials'
on conflict (code) do update set title_en = excluded.title_en, title_ar = excluded.title_ar;

insert into competencies (course_id, code, title_en, title_ar, description_en, description_ar, required_evidence, sort_order)
select id, 'ROOM-002', 'Device verification closed-loop communication', 'التحقق المغلق من الأجهزة', 'Verify stent/balloon size, length, expiry, pressure limit, and packaging integrity.', 'التحقق من مقاس وطول وصلاحية الدعامة/البالون وحد الضغط وسلامة التغليف.', 'Direct observation + documentation sample', 2
from courses where slug = 'circulating-scrub-essentials'
on conflict (code) do update set title_en = excluded.title_en, title_ar = excluded.title_ar;

insert into simulation_scenarios (slug, title_en, title_ar, clinical_priority, prompt_en, prompt_ar, correct_answer_index, choices_en, choices_ar, rationale_en, rationale_ar) values
('stemi-activation', 'STEMI Activation', 'تفعيل STEMI', 'Critical', 'Patient arrives from ER with ECG-confirmed STEMI and urgent handover.', 'يصل المريض من الطوارئ مع ECG يؤكد STEMI وتسليم عاجل.', 1,
 '["Open all PCI devices immediately", "Verify patient identity, allergies, consent status, ECG, IV access and team readiness", "Wait until angiography result"]'::jsonb,
 '["فتح جميع أجهزة PCI مباشرة", "التحقق من الهوية والحساسية والموافقة وECG والوريد وجاهزية الفريق", "الانتظار حتى نتيجة التصوير"]'::jsonb,
 'This prevents wrong patient/procedure/allergy events while preserving the urgent STEMI workflow.',
 'هذا يمنع أخطاء المريض/الإجراء/الحساسية مع الحفاظ على سرعة مسار STEMI.'),
('radial-hematoma', 'Radial Hematoma', 'Radial Hematoma', 'High', 'Recovery nurse notices swelling and increasing pain at the radial access site.', 'لاحظ ممرض الإفاقة تورمًا وألمًا متزايدًا في موقع الدخول الشعاعي.', 0,
 '["Apply compression, assess neurovascular status, notify operator and document", "Ignore if pulse is still present", "Remove all monitoring and discharge"]'::jsonb,
 '["الضغط، تقييم Neurovascular، إبلاغ الطبيب، والتوثيق", "تجاهله إذا كان النبض موجودًا", "إزالة المراقبة والخروج"]'::jsonb,
 'Early compression and neurovascular checks reduce progression and detect limb compromise.',
 'الضغط المبكر وفحص Neurovascular يقللان التفاقم ويكشفان أي تأثر في الطرف.')
on conflict (slug) do update set
  title_en = excluded.title_en,
  title_ar = excluded.title_ar,
  prompt_en = excluded.prompt_en,
  prompt_ar = excluded.prompt_ar,
  choices_en = excluded.choices_en,
  choices_ar = excluded.choices_ar;
