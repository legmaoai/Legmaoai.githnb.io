(() => {
  'use strict';
  const languages = [
    ['en','EN · English'],['zh','中文 · 简体'],['zh-tw','繁體中文'],['km','ខ្មែរ · Khmer'],['ja','日本語'],['ko','한국어'],['th','ไทย · Thai'],['vi','Tiếng Việt'],['id','Bahasa Indonesia'],['fr','Français'],['es','Español'],['de','Deutsch']
  ];
  const translations = {
    en:{skip:'Skip to content',back:'Back to LEGMAO ↗',eyebrow:'THE BUSINESS CHALLENGER · 01 / START HERE',title:'CHALLENGE<br>YOUR BUSINESS.',lead:'Tell us what feels stuck, slower than it should, or ready to change. We start by understanding the business behind the challenge.',step1:'Business audit',step2:'Conversation',step3:'Proposal',formKicker:'A GOOD PLACE TO BEGIN',formTitle:'What is the<br><span>real challenge?</span>',privacy:'Share only what you are comfortable sharing. This page prepares an email on your device; it does not store or send your details.',name:'Your name',email:'Work email',business:'Business or organization',challenge:'What feels harder than it should?',consent:'I agree that LEGMAO may use these details to respond to my enquiry.',submit:'Prepare my challenge',footer:'LEGMAO — THE BUSINESS CHALLENGER',platform:'The business system',industries:'Industries',contact:'Contact',namePlaceholder:'How should we address you?',emailPlaceholder:'you@company.com',businessPlaceholder:'Optional',challengePlaceholder:'A few sentences is enough. What is happening, and who feels the impact?',invalid:'Please complete the required fields and describe the challenge in at least 20 characters.',mailto:'Your email app will open with a draft. Review it before sending.'},
    zh:{skip:'跳转到正文',back:'返回 LEGMAO ↗',eyebrow:'商业挑战者 · 01 / 从这里开始',title:'挑战<br>你的业务。',lead:'告诉我们哪里停滞不前、进展比预期慢，或正准备改变。我们会先理解挑战背后的业务。',step1:'业务诊断',step2:'深入沟通',step3:'方案建议',formKicker:'从这里开始',formTitle:'真正的<br><span>挑战是什么？</span>',privacy:'只需分享你愿意提供的信息。此页面会在你的设备上准备邮件，不会储存或发送你的资料。',name:'姓名',email:'工作邮箱',business:'企业或组织',challenge:'什么事情比它本该有的更难？',consent:'我同意 LEGMAO 使用这些信息回复我的咨询。',submit:'准备提交业务挑战',footer:'LEGMAO — 商业挑战者',platform:'业务系统',industries:'行业领域',contact:'联系',namePlaceholder:'我们该如何称呼你？',emailPlaceholder:'you@company.com',businessPlaceholder:'选填',challengePlaceholder:'简单描述几句即可：发生了什么？哪些人受到了影响？',invalid:'请填写必填项，并至少用 20 个字符描述业务挑战。',mailto:'邮件应用将打开一封已填写内容的草稿，请检查后再发送。'},
    'zh-tw':{skip:'跳至正文',back:'返回 LEGMAO ↗',eyebrow:'商業挑戰者 · 01 / 從這裡開始',title:'挑戰<br>你的業務。',lead:'告訴我們哪裡停滯、進展比預期慢，或正準備改變。我們會先理解挑戰背後的業務。',step1:'業務診斷',step2:'深入溝通',step3:'方案建議',formKicker:'從這裡開始',formTitle:'真正的<br><span>挑戰是什麼？</span>',privacy:'只需分享你願意提供的資訊。此頁面會在你的裝置上準備電子郵件，不會儲存或傳送資料。',name:'姓名',email:'工作電子郵件',business:'企業或組織',challenge:'哪些事情比原本應該的更困難？',consent:'我同意 LEGMAO 使用這些資料回覆我的詢問。',submit:'準備提交業務挑戰',footer:'LEGMAO — 商業挑戰者',platform:'業務系統',industries:'產業領域',contact:'聯絡',namePlaceholder:'我們該如何稱呼你？',emailPlaceholder:'you@company.com',businessPlaceholder:'選填',challengePlaceholder:'簡單描述幾句即可：發生了什麼？哪些人受到影響？',invalid:'請填寫必填欄位，並至少用 20 個字元描述業務挑戰。',mailto:'電子郵件應用程式將開啟已填妥的草稿，請檢查後再傳送。'},
    ja:{skip:'本文へ移動',back:'LEGMAOに戻る ↗',eyebrow:'ビジネス・チャレンジャー · 01 / ここから始める',title:'ビジネスに<br>問いを。',lead:'停滞していること、想定より遅いこと、変えたいことをお聞かせください。課題の背景にある事業を理解することから始めます。',step1:'事業診断',step2:'対話',step3:'提案',formKicker:'ここから始めましょう',formTitle:'本当の<br><span>課題は何ですか？</span>',privacy:'共有できる範囲でご記入ください。このページは端末上でメールの下書きを作成します。情報は保存・送信されません。',name:'お名前',email:'仕事用メール',business:'会社・組織名',challenge:'何が必要以上に難しくなっていますか？',consent:'LEGMAOが問い合わせへの返信にこの情報を使用することに同意します。',submit:'課題メールを準備',footer:'LEGMAO — ビジネス・チャレンジャー',platform:'事業の仕組み',industries:'業界',contact:'お問い合わせ',namePlaceholder:'お名前を入力してください',emailPlaceholder:'you@company.com',businessPlaceholder:'任意',challengePlaceholder:'数文で構いません。何が起き、誰に影響していますか？',invalid:'必須項目を入力し、課題を20文字以上で説明してください。',mailto:'メールアプリで下書きを開きます。内容を確認してから送信してください。'},
    ko:{skip:'본문으로 건너뛰기',back:'LEGMAO로 돌아가기 ↗',eyebrow:'비즈니스 챌린저 · 01 / 여기서 시작',title:'비즈니스에<br>도전하세요.',lead:'정체되거나 예상보다 느리거나 바꾸고 싶은 점을 알려주세요. 문제 뒤에 있는 비즈니스 상황을 이해하는 것부터 시작합니다.',step1:'비즈니스 진단',step2:'대화',step3:'제안',formKicker:'좋은 시작점',formTitle:'진짜<br><span>과제는 무엇인가요?</span>',privacy:'공유하고 싶은 내용만 작성하세요. 이 페이지는 기기에서 이메일 초안을 준비하며 정보를 저장하거나 전송하지 않습니다.',name:'이름',email:'업무용 이메일',business:'회사 또는 조직',challenge:'무엇이 필요 이상으로 어렵게 느껴지나요?',consent:'LEGMAO가 문의 답변을 위해 이 정보를 사용하는 데 동의합니다.',submit:'비즈니스 과제 준비하기',footer:'LEGMAO — 비즈니스 챌린저',platform:'비즈니스 시스템',industries:'산업',contact:'문의',namePlaceholder:'어떻게 불러드릴까요?',emailPlaceholder:'you@company.com',businessPlaceholder:'선택 사항',challengePlaceholder:'몇 문장으로 충분합니다. 무슨 일이 있고 누가 영향을 받나요?',invalid:'필수 항목을 입력하고 과제를 20자 이상으로 설명해 주세요.',mailto:'이메일 앱에서 초안이 열립니다. 보내기 전에 내용을 확인하세요.'},
    km:{skip:'រំលងទៅខ្លឹមសារ',back:'ត្រឡប់ទៅ LEGMAO ↗',eyebrow:'អ្នកប្រកួតប្រជែងអាជីវកម្ម · ០១ / ចាប់ផ្តើមទីនេះ',title:'ប្រកួតប្រជែង<br>អាជីវកម្មរបស់អ្នក។',lead:'ប្រាប់យើងពីអ្វីដែលជាប់គាំង យឺតជាងគួរ ឬត្រៀមផ្លាស់ប្តូរ។ យើងចាប់ផ្តើមដោយយល់ពីអាជីវកម្មនៅពីក្រោយបញ្ហា។',step1:'ពិនិត្យអាជីវកម្ម',step2:'សន្ទនា',step3:'សំណើ',formKicker:'កន្លែងល្អដើម្បីចាប់ផ្តើម',formTitle:'បញ្ហា<br><span>ពិតប្រាកដជាអ្វី?</span>',privacy:'ចែករំលែកតែព័ត៌មានដែលអ្នកស្រួលចិត្ត។ ទំព័រនេះរៀបចំអ៊ីមែលនៅលើឧបករណ៍របស់អ្នក ហើយមិនរក្សាទុកឬផ្ញើព័ត៌មានទេ។',name:'ឈ្មោះ',email:'អ៊ីមែលការងារ',business:'អាជីវកម្ម ឬអង្គការ',challenge:'តើអ្វីកំពុងពិបាកជាងការគួរ?',consent:'ខ្ញុំយល់ព្រមឱ្យ LEGMAO ប្រើព័ត៌មាននេះដើម្បីឆ្លើយតបការសាកសួរ។',submit:'រៀបចំបញ្ហាអាជីវកម្ម',footer:'LEGMAO — អ្នកប្រកួតប្រជែងអាជីវកម្ម',platform:'ប្រព័ន្ធអាជីវកម្ម',industries:'ឧស្សាហកម្ម',contact:'ទំនាក់ទំនង',namePlaceholder:'យើងគួរហៅអ្នកយ៉ាងដូចម្តេច?',emailPlaceholder:'you@company.com',businessPlaceholder:'មិនចាំបាច់',challengePlaceholder:'សរសេរពីរបីប្រយោគបានហើយ។ តើមានអ្វីកើតឡើង ហើយនរណារងផលប៉ះពាល់?',invalid:'សូមបំពេញព័ត៌មានចាំបាច់ និងពិពណ៌នាបញ្ហាយ៉ាងតិច ២០ តួអក្សរ។',mailto:'កម្មវិធីអ៊ីមែលនឹងបើកសេចក្តីព្រាង។ សូមពិនិត្យមុនផ្ញើ។'},
    th:{skip:'ข้ามไปยังเนื้อหา',back:'กลับไป LEGMAO ↗',eyebrow:'ผู้ท้าทายธุรกิจ · 01 / เริ่มที่นี่',title:'ท้าทาย<br>ธุรกิจของคุณ',lead:'เล่าให้เราฟังว่าส่วนไหนติดขัด ช้ากว่าที่ควร หรือพร้อมเปลี่ยน เราเริ่มจากการเข้าใจธุรกิจที่อยู่เบื้องหลังความท้าทาย',step1:'วิเคราะห์ธุรกิจ',step2:'พูดคุย',step3:'ข้อเสนอ',formKicker:'จุดเริ่มต้นที่ดี',formTitle:'ความท้าทาย<br><span>ที่แท้จริงคืออะไร?</span>',privacy:'แชร์เฉพาะข้อมูลที่คุณสะดวกใจ หน้านี้เตรียมอีเมลบนอุปกรณ์ของคุณ โดยไม่จัดเก็บหรือส่งข้อมูล',name:'ชื่อของคุณ',email:'อีเมลที่ทำงาน',business:'ธุรกิจหรือองค์กร',challenge:'อะไรที่ยากกว่าที่ควรจะเป็น?',consent:'ฉันยินยอมให้ LEGMAO ใช้ข้อมูลนี้เพื่อตอบกลับคำถาม',submit:'เตรียมความท้าทาย',footer:'LEGMAO — ผู้ท้าทายธุรกิจ',platform:'ระบบธุรกิจ',industries:'อุตสาหกรรม',contact:'ติดต่อ',namePlaceholder:'เราควรเรียกคุณว่าอะไร?',emailPlaceholder:'you@company.com',businessPlaceholder:'ไม่บังคับ',challengePlaceholder:'เพียงไม่กี่ประโยคก็พอ เกิดอะไรขึ้น และใครได้รับผลกระทบ?',invalid:'กรอกข้อมูลที่จำเป็นและอธิบายความท้าทายอย่างน้อย 20 ตัวอักษร',mailto:'แอปอีเมลจะเปิดฉบับร่าง โปรดตรวจสอบก่อนส่ง'},
    vi:{skip:'Chuyển đến nội dung',back:'Quay lại LEGMAO ↗',eyebrow:'NGƯỜI THÁCH THỨC DOANH NGHIỆP · 01 / BẮT ĐẦU',title:'THÁCH THỨC<br>DOANH NGHIỆP.',lead:'Hãy cho chúng tôi biết điều gì đang bế tắc, chậm hơn mong muốn hoặc cần thay đổi. Chúng tôi bắt đầu bằng việc hiểu doanh nghiệp phía sau vấn đề.',step1:'Đánh giá doanh nghiệp',step2:'Trao đổi',step3:'Đề xuất',formKicker:'Một nơi phù hợp để bắt đầu',formTitle:'Thách thức<br><span>thực sự là gì?</span>',privacy:'Chỉ chia sẻ thông tin bạn thấy thoải mái. Trang này tạo bản nháp email trên thiết bị, không lưu hoặc gửi dữ liệu.',name:'Tên của bạn',email:'Email công việc',business:'Doanh nghiệp hoặc tổ chức',challenge:'Điều gì đang khó hơn mức cần thiết?',consent:'Tôi đồng ý để LEGMAO sử dụng thông tin này nhằm phản hồi yêu cầu.',submit:'Chuẩn bị thách thức',footer:'LEGMAO — NGƯỜI THÁCH THỨC DOANH NGHIỆP',platform:'Hệ thống doanh nghiệp',industries:'Ngành nghề',contact:'Liên hệ',namePlaceholder:'Chúng tôi nên xưng hô với bạn thế nào?',emailPlaceholder:'you@company.com',businessPlaceholder:'Không bắt buộc',challengePlaceholder:'Vài câu là đủ. Điều gì đang xảy ra và ai chịu ảnh hưởng?',invalid:'Vui lòng điền các mục bắt buộc và mô tả thách thức ít nhất 20 ký tự.',mailto:'Ứng dụng email sẽ mở bản nháp. Vui lòng kiểm tra trước khi gửi.'},
    id:{skip:'Lewati ke konten',back:'Kembali ke LEGMAO ↗',eyebrow:'BUSINESS CHALLENGER · 01 / MULAI DI SINI',title:'TANTANG<br>BISNIS ANDA.',lead:'Ceritakan hal yang terasa macet, lebih lambat dari semestinya, atau siap berubah. Kami mulai dengan memahami bisnis di balik tantangan tersebut.',step1:'Audit bisnis',step2:'Percakapan',step3:'Proposal',formKicker:'Awal yang baik',formTitle:'Apa tantangan<br><span>yang sebenarnya?</span>',privacy:'Bagikan hanya hal yang nyaman Anda sampaikan. Halaman ini menyiapkan email di perangkat Anda; data tidak disimpan atau dikirim.',name:'Nama Anda',email:'Email kerja',business:'Bisnis atau organisasi',challenge:'Apa yang terasa lebih sulit dari semestinya?',consent:'Saya setuju LEGMAO menggunakan detail ini untuk menanggapi pertanyaan saya.',submit:'Siapkan tantangan bisnis',footer:'LEGMAO — BUSINESS CHALLENGER',platform:'Sistem bisnis',industries:'Industri',contact:'Kontak',namePlaceholder:'Bagaimana kami sebaiknya menyapa Anda?',emailPlaceholder:'you@company.com',businessPlaceholder:'Opsional',challengePlaceholder:'Beberapa kalimat cukup. Apa yang terjadi dan siapa yang terdampak?',invalid:'Lengkapi kolom wajib dan jelaskan tantangan minimal 20 karakter.',mailto:'Aplikasi email akan membuka draf. Tinjau sebelum mengirim.'},
    fr:{skip:'Aller au contenu',back:'Retour à LEGMAO ↗',eyebrow:'LE CHALLENGER DES ENTREPRISES · 01 / COMMENCER',title:'CHALLENGEONS<br>VOTRE ACTIVITÉ.',lead:'Dites-nous ce qui bloque, prend plus de temps que prévu ou doit évoluer. Nous commençons par comprendre l’activité derrière le défi.',step1:'Diagnostic métier',step2:'Échange',step3:'Proposition',formKicker:'Un bon point de départ',formTitle:'Quel est le<br><span>vrai défi ?</span>',privacy:'Partagez uniquement ce que vous souhaitez. Cette page prépare un e-mail sur votre appareil ; elle ne stocke ni n’envoie vos informations.',name:'Votre nom',email:'E-mail professionnel',business:'Entreprise ou organisation',challenge:'Qu’est-ce qui semble plus difficile que nécessaire ?',consent:'J’accepte que LEGMAO utilise ces informations pour répondre à ma demande.',submit:'Préparer mon défi',footer:'LEGMAO — LE CHALLENGER DES ENTREPRISES',platform:'Le système métier',industries:'Secteurs',contact:'Contact',namePlaceholder:'Comment devons-nous vous appeler ?',emailPlaceholder:'vous@entreprise.com',businessPlaceholder:'Facultatif',challengePlaceholder:'Quelques phrases suffisent. Que se passe-t-il et qui est concerné ?',invalid:'Renseignez les champs obligatoires et décrivez le défi en 20 caractères minimum.',mailto:'Votre messagerie ouvrira un brouillon. Vérifiez-le avant de l’envoyer.'},
    es:{skip:'Ir al contenido',back:'Volver a LEGMAO ↗',eyebrow:'EL RETADOR EMPRESARIAL · 01 / EMPEZAR AQUÍ',title:'DESAFÍA<br>TU NEGOCIO.',lead:'Cuéntanos qué está atascado, va más lento de lo previsto o está listo para cambiar. Empezamos por entender el negocio que hay detrás.',step1:'Diagnóstico empresarial',step2:'Conversación',step3:'Propuesta',formKicker:'Un buen lugar para empezar',formTitle:'¿Cuál es el<br><span>reto real?</span>',privacy:'Comparte solo lo que te resulte cómodo. Esta página prepara un correo en tu dispositivo; no guarda ni envía tus datos.',name:'Tu nombre',email:'Correo de trabajo',business:'Empresa u organización',challenge:'¿Qué resulta más difícil de lo que debería?',consent:'Acepto que LEGMAO use estos datos para responder a mi consulta.',submit:'Preparar mi reto',footer:'LEGMAO — EL RETADOR EMPRESARIAL',platform:'El sistema empresarial',industries:'Sectores',contact:'Contacto',namePlaceholder:'¿Cómo debemos llamarte?',emailPlaceholder:'tu@empresa.com',businessPlaceholder:'Opcional',challengePlaceholder:'Bastan unas frases. ¿Qué ocurre y a quién afecta?',invalid:'Completa los campos obligatorios y describe el reto con al menos 20 caracteres.',mailto:'Tu aplicación de correo abrirá un borrador. Revísalo antes de enviarlo.'},
    de:{skip:'Zum Inhalt springen',back:'Zurück zu LEGMAO ↗',eyebrow:'DER BUSINESS CHALLENGER · 01 / HIER BEGINNEN',title:'STELLEN SIE<br>IHR UNTERNEHMEN INFRAGE.',lead:'Was stockt, dauert länger als nötig oder sollte sich ändern? Wir beginnen damit, das Unternehmen hinter der Herausforderung zu verstehen.',step1:'Geschäftsanalyse',step2:'Gespräch',step3:'Vorschlag',formKicker:'Ein guter Anfang',formTitle:'Was ist die<br><span>eigentliche Herausforderung?</span>',privacy:'Teilen Sie nur, womit Sie sich wohlfühlen. Diese Seite erstellt einen E-Mail-Entwurf auf Ihrem Gerät und speichert oder sendet Ihre Angaben nicht.',name:'Ihr Name',email:'Geschäftliche E-Mail',business:'Unternehmen oder Organisation',challenge:'Was ist schwieriger, als es sein sollte?',consent:'Ich bin einverstanden, dass LEGMAO diese Angaben zur Beantwortung meiner Anfrage verwendet.',submit:'Herausforderung vorbereiten',footer:'LEGMAO — DER BUSINESS CHALLENGER',platform:'Das Geschäftssystem',industries:'Branchen',contact:'Kontakt',namePlaceholder:'Wie dürfen wir Sie ansprechen?',emailPlaceholder:'sie@unternehmen.de',businessPlaceholder:'Optional',challengePlaceholder:'Ein paar Sätze genügen. Was passiert und wer ist betroffen?',invalid:'Bitte füllen Sie die Pflichtfelder aus und beschreiben Sie die Herausforderung mit mindestens 20 Zeichen.',mailto:'Ihr E-Mail-Programm öffnet einen Entwurf. Prüfen Sie ihn vor dem Senden.'}
  };
  const names = Object.fromEntries(languages);
  const submitCopy = {
    en:{privacy:'Your details are sent through FormSubmit to LEGMAO so we can reply. FormSubmit says submissions may be retained for up to 30 days.',submit:'Send my challenge',sending:'Sending your challenge…',success:'Your challenge was submitted. Thank you — we’ll be in touch.',error:'We could not send your challenge. Please try again or contact us directly.',local:'This local file preview cannot submit forms. Publish the site to an HTTPS address, then try again.'},
    zh:{privacy:'你的信息会通过 FormSubmit 发送给 LEGMAO，以便我们回复。FormSubmit 表示提交内容可能保留最多 30 天。',submit:'发送业务挑战',sending:'正在发送…',success:'业务挑战已提交。谢谢，我们会联系你。',error:'发送失败。请重试，或通过下方联系方式联系我们。',local:'当前是本地文件预览，无法提交表单。请先将网站发布到 HTTPS 地址，再试一次。'},
    'zh-tw':{privacy:'你的資料會透過 FormSubmit 傳送給 LEGMAO，以便我們回覆。FormSubmit 表示提交資料可能保留最多 30 天。',submit:'提交業務挑戰',sending:'正在傳送…',success:'業務挑戰已提交。謝謝，我們會與你聯絡。',error:'傳送失敗。請重試，或透過下方聯絡方式與我們聯繫。',local:'目前是本機檔案預覽，無法提交表單。請先將網站發佈至 HTTPS 網址，再試一次。'},
    km:{privacy:'ព័ត៌មានរបស់អ្នកត្រូវបានផ្ញើតាម FormSubmit ទៅ LEGMAO ដើម្បីឱ្យយើងអាចឆ្លើយតប។ FormSubmit បញ្ជាក់ថា ព័ត៌មានអាចត្រូវបានរក្សាទុករហូតដល់ ៣០ ថ្ងៃ។',submit:'ផ្ញើបញ្ហាអាជីវកម្ម',sending:'កំពុងផ្ញើ…',success:'បានផ្ញើបញ្ហារបស់អ្នកហើយ។ សូមអរគុណ យើងនឹងទាក់ទងទៅអ្នក។',error:'មិនអាចផ្ញើបានទេ។ សូមព្យាយាមម្ដងទៀត ឬទាក់ទងយើងដោយផ្ទាល់។',local:'ការមើលឯកសារក្នុងម៉ាស៊ីននេះមិនអាចផ្ញើទម្រង់បានទេ។ សូមបង្ហោះគេហទំព័រទៅ HTTPS រួចព្យាយាមម្ដងទៀត។'},
    ja:{privacy:'返信のため、入力内容は FormSubmit を通じて LEGMAO に送信されます。FormSubmit は送信内容を最長30日間保持する場合があると案内しています。',submit:'課題を送信',sending:'送信中…',success:'課題を送信しました。ありがとうございます。折り返しご連絡します。',error:'送信できませんでした。再試行するか、下記の連絡先からご連絡ください。',local:'ローカルファイルのプレビューからは送信できません。サイトを HTTPS で公開してから再度お試しください。'},
    ko:{privacy:'답변을 위해 입력하신 정보가 FormSubmit을 통해 LEGMAO로 전송됩니다. FormSubmit은 제출 내용을 최대 30일간 보관할 수 있다고 안내합니다.',submit:'비즈니스 과제 보내기',sending:'보내는 중…',success:'과제가 제출되었습니다. 감사합니다. 연락드리겠습니다.',error:'보내지 못했습니다. 다시 시도하거나 아래 연락처로 문의해 주세요.',local:'로컬 파일 미리보기에서는 양식을 제출할 수 없습니다. 사이트를 HTTPS로 게시한 뒤 다시 시도해 주세요.'},
    th:{privacy:'ข้อมูลของคุณจะถูกส่งผ่าน FormSubmit ไปยัง LEGMAO เพื่อให้เราตอบกลับได้ FormSubmit ระบุว่าอาจเก็บข้อมูลที่ส่งไว้ได้นานสูงสุด 30 วัน',submit:'ส่งความท้าทายทางธุรกิจ',sending:'กำลังส่ง…',success:'ส่งความท้าทายแล้ว ขอบคุณ เราจะติดต่อกลับ',error:'ส่งไม่สำเร็จ โปรดลองอีกครั้งหรือติดต่อเราโดยตรง',local:'หน้าแสดงตัวอย่างจากไฟล์ในเครื่องส่งแบบฟอร์มไม่ได้ โปรดเผยแพร่เว็บไซต์ผ่าน HTTPS แล้วลองอีกครั้ง'},
    vi:{privacy:'Thông tin của bạn được gửi qua FormSubmit đến LEGMAO để chúng tôi phản hồi. FormSubmit cho biết nội dung gửi có thể được lưu giữ tối đa 30 ngày.',submit:'Gửi thách thức kinh doanh',sending:'Đang gửi…',success:'Đã gửi thách thức. Cảm ơn bạn — chúng tôi sẽ liên hệ.',error:'Không thể gửi. Vui lòng thử lại hoặc liên hệ trực tiếp với chúng tôi.',local:'Bản xem trước từ tệp cục bộ không thể gửi biểu mẫu. Hãy xuất bản trang web bằng HTTPS rồi thử lại.'},
    id:{privacy:'Data Anda dikirim melalui FormSubmit ke LEGMAO agar kami dapat membalas. FormSubmit menyatakan bahwa kiriman dapat disimpan hingga 30 hari.',submit:'Kirim tantangan bisnis',sending:'Mengirim…',success:'Tantangan Anda telah dikirim. Terima kasih — kami akan menghubungi Anda.',error:'Tantangan tidak dapat dikirim. Coba lagi atau hubungi kami secara langsung.',local:'Pratinjau file lokal tidak dapat mengirim formulir. Publikasikan situs dengan HTTPS, lalu coba lagi.'},
    fr:{privacy:'Vos informations sont envoyées via FormSubmit à LEGMAO afin que nous puissions vous répondre. FormSubmit indique que les envois peuvent être conservés jusqu’à 30 jours.',submit:'Envoyer mon défi',sending:'Envoi en cours…',success:'Votre défi a été envoyé. Merci — nous vous contacterons.',error:'Envoi impossible. Réessayez ou contactez-nous directement.',local:'L’aperçu d’un fichier local ne peut pas envoyer le formulaire. Publiez le site en HTTPS, puis réessayez.'},
    es:{privacy:'Tus datos se envían a LEGMAO mediante FormSubmit para que podamos responderte. FormSubmit indica que los envíos pueden conservarse hasta 30 días.',submit:'Enviar mi desafío',sending:'Enviando…',success:'Tu desafío se ha enviado. Gracias; nos pondremos en contacto contigo.',error:'No se pudo enviar. Inténtalo de nuevo o contáctanos directamente.',local:'La vista previa de un archivo local no puede enviar formularios. Publica el sitio con HTTPS y vuelve a intentarlo.'},
    de:{privacy:'Ihre Angaben werden über FormSubmit an LEGMAO gesendet, damit wir antworten können. FormSubmit gibt an, dass Einsendungen bis zu 30 Tage gespeichert werden können.',submit:'Herausforderung senden',sending:'Wird gesendet…',success:'Ihre Herausforderung wurde gesendet. Vielen Dank — wir melden uns.',error:'Senden fehlgeschlagen. Bitte versuchen Sie es erneut oder kontaktieren Sie uns direkt.',local:'Eine lokale Dateivorschau kann das Formular nicht senden. Veröffentlichen Sie die Website über HTTPS und versuchen Sie es erneut.'}
  };
  const activationCopy = {
    en:'First-time setup: FormSubmit sent an activation email to LEGMAO. Check the inbox and spam folder, activate the form, then submit again if needed.',
    zh:'这是首次启用：FormSubmit 已向 LEGMAO 邮箱发送验证邮件。请检查收件箱和垃圾邮件并点击验证链接；如有需要，再重新提交。',
    'zh-tw':'這是首次啟用：FormSubmit 已向 LEGMAO 信箱寄出驗證郵件。請查看收件匣與垃圾郵件並點擊驗證連結；如有需要，再重新提交。',
    km:'ការប្រើលើកដំបូង៖ FormSubmit បានផ្ញើអ៊ីមែលបញ្ជាក់ទៅ LEGMAO។ សូមពិនិត្យប្រអប់សំបុត្រ និងសារឥតបានការ រួចចុចតំណបញ្ជាក់។',
    ja:'初回設定です。FormSubmit から LEGMAO に有効化メールが送信されました。受信トレイと迷惑メールを確認し、リンクをクリックしてください。',
    ko:'첫 설정 단계입니다. FormSubmit이 LEGMAO로 활성화 이메일을 보냈습니다. 받은편지함과 스팸함을 확인해 링크를 눌러 주세요.',
    th:'การตั้งค่าครั้งแรก: FormSubmit ส่งอีเมลยืนยันไปยัง LEGMAO แล้ว โปรดตรวจสอบกล่องจดหมายและสแปม แล้วคลิกลิงก์ยืนยัน',
    vi:'Thiết lập lần đầu: FormSubmit đã gửi email kích hoạt đến LEGMAO. Hãy kiểm tra hộp thư đến và thư rác rồi nhấn liên kết xác nhận.',
    id:'Penyiapan pertama: FormSubmit mengirim email aktivasi ke LEGMAO. Periksa kotak masuk dan spam, lalu klik tautan aktivasi.',
    fr:'Première activation : FormSubmit a envoyé un e-mail à LEGMAO. Vérifiez la boîte de réception et les courriers indésirables, puis cliquez sur le lien.',
    es:'Primera activación: FormSubmit envió un correo a LEGMAO. Revisa la bandeja de entrada y el correo no deseado y pulsa el enlace de activación.',
    de:'Erstaktivierung: FormSubmit hat eine E-Mail an LEGMAO gesendet. Prüfen Sie Posteingang und Spam und klicken Sie auf den Aktivierungslink.'
  };
  const navCopy = {
    en:['Solutions','Industries','Examples','Company'],zh:['业务挑战','行业领域','示意案例','关于我们'],'zh-tw':['業務挑戰','產業領域','示意案例','關於我們'],
    km:['ដំណោះស្រាយ','ឧស្សាហកម្ម','ឧទាហរណ៍','អំពីយើង'],ja:['事業課題','業界','事例','会社案内'],ko:['비즈니스 과제','산업','사례','회사 소개'],
    th:['โจทย์ธุรกิจ','อุตสาหกรรม','ตัวอย่าง','เกี่ยวกับเรา'],vi:['Thách thức kinh doanh','Ngành nghề','Ví dụ','Giới thiệu'],id:['Tantangan bisnis','Industri','Contoh','Tentang kami'],
    fr:['Défis métier','Secteurs','Exemples','À propos'],es:['Retos empresariales','Sectores','Ejemplos','Empresa'],de:['Geschäftsfragen','Branchen','Beispiele','Unternehmen']
  };
  const picker = document.getElementById('challengeLang');
  const label = document.getElementById('challengeLangLabel');
  const menu = document.getElementById('challengeLangMenu');
  const form = document.getElementById('business-challenge-form');
  const status = document.getElementById('challengeStatus');
  const nav=document.getElementById('challengeNav');
  const menuButton=document.getElementById('challengeMenuToggle');
  const localKey = 'legmao-language';
  let stored='en'; try{stored=localStorage.getItem(localKey)||'en';}catch{}
  let language = new URLSearchParams(location.search).get('lang') || stored || 'en';
  if (!translations[language]) language = 'en';
  menu.innerHTML = languages.map(([code,name]) => `<a href="?lang=${encodeURIComponent(code)}" data-lang="${code}"${code===language?' aria-current="true"':''}>${name}</a>`).join('');
  const applyLanguage = code => {
    language = translations[code] ? code : 'en';
    const copy = translations[language];
    const stateCopy = submitCopy[language];
    document.documentElement.lang = language;
    label.textContent = names[language];
    document.querySelectorAll('[data-t]').forEach(node => { if (copy[node.dataset.t]) node.innerHTML = copy[node.dataset.t]; });
    document.querySelectorAll('[data-p]').forEach(node => { if (copy[node.dataset.p]) node.placeholder = copy[node.dataset.p]; });
    document.querySelector('[data-t="privacy"]').textContent = stateCopy.privacy;
    document.querySelector('[data-t="submit"]').textContent = stateCopy.submit;
    document.querySelectorAll('[data-nav]').forEach(node=>{const i={solutions:0,industries:1,examples:2,company:3}[node.dataset.nav];node.textContent=navCopy[language][i];});
    menu.querySelectorAll('[data-lang]').forEach(node => { if (node.dataset.lang === language) node.setAttribute('aria-current','true'); else node.removeAttribute('aria-current'); });
    document.title = `${stateCopy.submit} — LEGMAO`;
    try{localStorage.setItem(localKey, language);}catch{}
  };
  menu.addEventListener('click', event => {
    const item = event.target.closest('[data-lang]');
    if (!item) return;
    event.preventDefault();
    const code = item.dataset.lang;
    const languageUrl=new URL(location.href);
    if(code==='en')languageUrl.searchParams.delete('lang');else languageUrl.searchParams.set('lang',code);
    history.replaceState(null,'',languageUrl.pathname+languageUrl.search+languageUrl.hash);
    applyLanguage(code);
    picker.open = false;
    label.focus();
  });
  document.addEventListener('click', event => { if (!picker.contains(event.target)) picker.open = false; });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') picker.open = false; });
  document.getElementById('year').textContent = new Date().getFullYear();
  if(nav&&menuButton){
    menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true';menuButton.setAttribute('aria-expanded',String(open));nav.classList.toggle('is-open',open);});
    nav.addEventListener('click',event=>{if(event.target.closest('a')){nav.classList.remove('is-open');menuButton.setAttribute('aria-expanded','false');}});
    document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menuButton.getAttribute('aria-expanded')==='true'){nav.classList.remove('is-open');menuButton.setAttribute('aria-expanded','false');menuButton.focus();event.preventDefault();}});
    window.addEventListener('resize',()=>{if(innerWidth>560){nav.classList.remove('is-open');menuButton.setAttribute('aria-expanded','false');}});
  }
  if (matchMedia('(any-pointer:fine)').matches) {
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y;
    if (dot && ring) {
      document.addEventListener('pointermove', event => {
        x = event.clientX; y = event.clientY;
        document.body.classList.add('cursor-ready');
      }, {passive:true});
      document.addEventListener('pointerover', event => { if (event.target.closest('a,button,summary,input,textarea')) document.body.classList.add('cursor-hover'); });
      document.addEventListener('pointerout', event => { if (event.target.closest('a,button,summary,input,textarea')) document.body.classList.remove('cursor-hover'); });
      const tick = () => {
        rx += (x-rx)*.85; ry += (y-ry)*.85;
        dot.style.left=`${x}px`; dot.style.top=`${y}px`; ring.style.left=`${rx}px`; ring.style.top=`${ry}px`;
        requestAnimationFrame(tick);
      };
      tick();
    }
  }
  let formState='idle', formDetail={}, dirty=false;
  const recovery=document.createElement('div');recovery.className='formRecovery';recovery.hidden=true;
  const retryLabel=document.createElement('label');retryLabel.className='retryCheck';
  const acknowledge=document.createElement('input');acknowledge.type='checkbox';acknowledge.id='retryAcknowledgement';
  const acknowledgeText=document.createElement('span');retryLabel.append(acknowledge,acknowledgeText);
  const retry=document.createElement('button');retry.type='button';retry.id='retryEnquiry';
  const backup=document.createElement('div');backup.className='backupContacts';
  for(const [href,text] of [['mailto:legmao.ai@gmail.com','legmao.ai@gmail.com'],['https://wa.me/855963628317','WhatsApp · +855 96 362 8317'],['https://t.me/LegmaoAI','Telegram · @LegmaoAI']]){const a=document.createElement('a');a.href=href;a.textContent=text;if(href.startsWith('https:')){a.target='_blank';a.rel='noopener noreferrer'}backup.append(a)}
  recovery.append(retryLabel,retry,backup);status.after(recovery);
  function renderFormState(){
    const copy=window.LEGMAOSiteCopy[language]||window.LEGMAOSiteCopy.en;
    const text=formDetail.reason==='invalid'?copy.invalid:formDetail.reason==='local'?copy.local:copy[{idle:'idle',submitting:'sending',success:'success',failure:'failure',timeout:'timeout'}[formState]];
    status.textContent=text;status.dataset.state=formState;status.classList.toggle('is-error',formState==='failure'||formState==='timeout');
    const button=form.querySelector('[type="submit"]');button.disabled=formState==='submitting'||formState==='success'||!!formDetail.uncertain;
    button.querySelector('span').textContent=formState==='submitting'?copy.sending:submitCopy[language].submit;
    form.setAttribute('aria-busy',String(formState==='submitting'));
    recovery.hidden=formState!=='failure'&&formState!=='timeout';retryLabel.hidden=!formDetail.uncertain;
    retry.textContent=copy.retry;acknowledgeText.textContent=copy.check;retry.disabled=formState==='submitting'||(!!formDetail.uncertain&&!acknowledge.checked);retry.hidden=formDetail.reason==='local';
  }
  const client=window.LEGMAOForm.create({onState:(state,detail)=>{formState=state;formDetail=detail;acknowledge.checked=false;if(state==='success')dirty=false;renderFormState()}});
  async function send(){
    if(client.isActive())return;
    if(!form.reportValidity())return;
    if(location.protocol==='file:'){formState='failure';formDetail={reason:'local'};renderFormState();return;}
    const values=new FormData(form);
    await client.submit({name:values.get('name'),email:values.get('email'),business:values.get('business'),challenge:values.get('challenge'),industry:values.get('industry'),service:values.get('service'),need:new URLSearchParams(location.search).get('need'),consent:form.querySelector('[name="consent"]').checked,honey:values.get('_honey')},acknowledge.checked);
  }
  form.addEventListener('submit',event=>{event.preventDefault();send()});
  retry.addEventListener('click',send);acknowledge.addEventListener('change',()=>{retry.disabled=!!formDetail.uncertain&&!acknowledge.checked});
  form.addEventListener('input',()=>{dirty=true;client.edit()});
  window.addEventListener('beforeunload',event=>{if(dirty||client.isActive()){event.preventDefault();event.returnValue=''}});
  new MutationObserver(renderFormState).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  renderFormState();
  applyLanguage(language);
})();
