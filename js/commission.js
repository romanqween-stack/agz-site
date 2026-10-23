/* ============================================================
   commission.js — панель приёмной комиссии (логика из «комиссия»)
   Входящие заявки, сводка, база заявок с фильтрами, доработка,
   этапы отбора, обращения, аналитика, карточка личного дела.
   Требует: js/app.js, js/admission-data.js, js/admission-core.js
   ============================================================ */

/* ================= I18N ================= */
const I18N = {
ru:{
  brand_h:'Панель приемной комиссии', brand_p:'Академия гражданской защиты им. М. Габдуллина · МЧС РК',
  lg_h:'Панель приемной комиссии', lg_sub:'Служебный доступ. Вход только для членов приемной комиссии Академии.',
  lg_l1:'Служебный логин', lg_l2:'Пароль', lg_btn:'Войти в панель', lg_demo:'Служебный доступ:',
  lg_e1:'Введите логин и пароль', lg_e2:'Неверный логин или пароль',
  nav_in:'Входящие', nav_dash:'Сводка', nav_base:'База заявок', nav_fix:'На доработке', nav_stages:'Этапы отбора', nav_appeals:'Обращения', nav_an:'Аналитика', nav_exit:'Выход',
  op_name:'Сотрудник приемной комиссии', op_role:'Член приемной комиссии · полный доступ к личным делам',
  in_h:'Входящие заявки абитуриентов',
  in_sub:'Заявки, поступившие из кабинетов абитуриентов и еще не рассмотренные комиссией. Откройте личное дело, чтобы проверить документы и принять решение.',
  in_empty:'Новых заявок нет — все поступившие заявки рассмотрены',
  in_zero:'Заявок пока нет. Они появятся здесь автоматически, как только абитуриенты отправят документы из своих кабинетов.',
  t_zero:'База пуста — ни одной заявки от абитуриентов еще не поступило',
  an_zero:'Данных для анализа пока нет',
  in_note:'Заявка появляется здесь автоматически в момент отправки абитуриентом. Решение комиссии сразу отображается в его кабинете.',
  in_new:'Поступила новая заявка от абитуриента',
  ds_h:'Сводка приемной кампании', ds_sub:'Единая база заявок абитуриентов. Нажмите на показатель, чтобы отфильтровать базу.',
  k_all:'Всего заявок', k_review:'На рассмотрении', k_fix:'На доработке', k_appr:'Допущено', k_rej:'Отказано',
  ds_q_h:'Требуют внимания сегодня', ds_l_h:'Журнал обмена с кабинетами абитуриентов',
  bs_h:'База заявок абитуриентов', bs_sub:'Автоматический анализ комплектности личных дел. Нажмите на строку — откроется личный кабинет абитуриента с полным составом документов.',
  fl_search:'Поиск', fl_search_ph:'ФИО, ИИН или № дела', fl_status:'Статус заявки', fl_region:'Регион', fl_compl:'Комплектность',
  o_all:'Все', o_c_full:'Полный комплект', o_c_part:'Неполный комплект', o_c_fix:'Есть замечания',
  t_case:'№ дела', t_app:'Абитуриент', t_region:'Регион', t_ent:'ЕНТ', t_compl:'Комплектность', t_date:'Поступила',
  t_flags:'Замечания', t_status:'Статус', t_doc:'Документ', t_cmt:'Замечание комиссии', t_act:'Действие', t_prob:'Проблема',
  t_empty:'По заданным условиям заявок не найдено', t_recv:'получено',
  fx_h:'Отправленные на доработку', fx_sub:'Личные дела с замечаниями. Абитуриент видит замечание в своем кабинете и загружает исправленный документ.',
  fx_empty:'Заявок с замечаниями нет',
  an_h:'Аналитика по документам', an_sub:'Где абитуриенты чаще всего допускают ошибки и какие документы задерживают формирование личных дел.',
  an_1:'Доля принятых документов по видам', an_2:'Заявки по регионам', an_3:'Проблемные документы (замечания и отсутствие)',
  an_note:'Показатели рассчитываются автоматически при каждом изменении статуса документа.',
  an_4:'Служебные действия', an_reset:'Очистить базу заявок',
  an_reset_p:'Полное удаление всех личных дел из базы. Действие необратимо — данные абитуриентов будут потеряны.',
  an_reset2:'Подтвердить удаление всех заявок', an_cancel:'Отмена',
  dc_view:'Открыть файл', pv_dl:'Скачать', no_file:'файл не загружен',
  pv_no:'Предпросмотр недоступен для этого формата — скачайте файл',
  b_ok:'принято', b_wait:'на проверке', b_fix:'требует исправления', b_none:'не загружено',
  st_draft:'черновик', st_review:'на рассмотрении', st_fix:'на доработке', st_approved:'допущен', st_rejected:'отказано',
  f_new:'новая', f_miss:'нет {n} док.', f_fix:'{n} замечание(й)', f_full:'комплект полный', f_ent_low:'ЕНТ ниже порога', f_ent_no:'нет ЕНТ',
  open_case:'Открыть дело', dr_data:'Данные абитуриента', dr_docs:'Документы личного дела', dr_final:'Решение по заявке', dr_stages:'Этапы отбора', dr_log:'История проверки',
  sb_ok:'пройден', sb_wait:'ожидает решения', sb_fail:'не пройден', sb_lock:'недоступен',
  sb_accept:'Допустить', sb_fail_btn:'Не допустить', sb_reset:'Вернуть на рассмотрение',
  sb_cmt_ph:'Комментарий комиссии (причина, обязательно)',
  sb_locked_doc:'Откроется после полной проверки документов личного дела',
  sb_locked_prev:'Откроется после успешного прохождения этапа «{p}»',
  n_stage_ok:'Этап «{s}» пройден', n_stage_fail:'Этап «{s}» не пройден. Причина: {c}',
  lg_stage_ok:'этап пройден', lg_stage_fail:'этап не пройден',
  sg2_h:'Этапы отбора абитуриентов',
  sg2_sub:'Решения комиссии по каждому этапу личного дела. Этап открывается автоматически после полной проверки документов и успешного прохождения предыдущего этапа.',
  sg2_empty:'Нет абитуриентов на этом этапе',
  ap_h:'Обращения абитуриентов', ap_sub:'Обращения об изменении данных, поступившие из личных кабинетов абитуриентов.',
  ap_empty:'Новых обращений нет', t_appeal_txt:'Текст обращения', ap_mark:'Отметить рассмотренным',
  ap_new:'Поступило новое обращение от абитуриента', ts_ap_seen:'Обращение отмечено рассмотренным',
  v_full_h:'Личное дело укомплектовано', v_full_p:'Все обязательные документы приняты — заявку можно допускать к отбору.',
  v_part_h:'Комплект неполный', v_part_p:'Принято {a} из {b} обязательных документов. Не хватает: {m}',
  v_fix_h:'Есть документы с замечаниями', v_fix_p:'Требуют замены: {m}',
  v_wait_h:'Документы ожидают проверки', v_wait_p:'На проверке {n} документ(ов). Проверьте файлы и вынесите решение по каждому.',
  v_draft_h:'Заявка еще не подана', v_draft_p:'Абитуриент зарегистрировался, но не отправил документы в комиссию.',
  b_accept:'Принять', b_remark:'Замечание', b_reset:'Вернуть на проверку',
  cmt_ph:'Текст замечания для абитуриента (обязательно)',
  fin_appr:'Допустить к отбору', fin_fix:'Отправить на доработку', fin_rej:'Отказать в допуске', fin_reopen:'Вернуть в рассмотрение',
  fin_note:'Решение сразу отображается в личном кабинете абитуриента.',
  fin_block:'Допуск невозможен: обязательные документы приняты не полностью.',
  rej_ph:'Причина отказа (будет видна абитуриенту)', fix_all_ph:'Что нужно исправить абитуриенту',
  l_fio:'ФИО', l_iin:'ИИН', l_dob:'Дата рождения', l_region:'Регион', l_city:'Населенный пункт', l_phone:'Телефон',
  l_ent:'Балл ЕНТ', l_priv:'Льготная категория', l_sub:'Дата подачи', ent_no:'не представлен', not_sent:'не отправлена',
  ent_ok:'✓ Сертификат подтвержден в базе', ent_fake:'✗ Сертификат не найден в базе — возможна подделка',
  ent_score:'балл по базе', ent_mismatch:'⚠ Балл в сертификате отличается от указанного при регистрации',
  ent_not_checked:'Абитуриент еще не проверил сертификат по базе', f_ent_fake:'сертификат ЕНТ не подтвержден',
  ts_ok:'Документ принят ✓', ts_fix:'Замечание отправлено абитуриенту', ts_need:'Введите текст замечания',
  ts_appr:'Заявка допущена к отбору ✓', ts_rej:'Вынесен отказ в допуске', ts_fixall:'Дело отправлено на доработку',
  ts_reopen:'Заявка возвращена в рассмотрение', ts_reset:'Документ возвращен на проверку', ts_bye:'Сеанс завершен',
  ts_reset_db:'База заявок очищена',
  n_ok:'Комиссия приняла документ «{d}»', n_fix:'Комиссия вернула документ «{d}» на исправление: {c}',
  n_appr:'Заявка допущена к дальнейшим этапам отбора', n_rej:'Комиссия отказала в допуске. Причина: {c}',
  n_fixall:'Личное дело возвращено на доработку. {c}', n_reopen:'Заявка возвращена комиссией в рассмотрение',
  lg_doc_ok:'принят документ', lg_doc_fix:'замечание по документу', lg_dec:'решение по заявке',
  urg_none:'Заявок, требующих срочного внимания, нет',
  sync_on:'Облачная база подключена: видны заявки со всех устройств', sync_off:'Облачная база не подключена: видны только заявки этого браузера', sync_wait:'Подключение к облачной базе…', sync_err:'Нет связи с облачной базой — проверьте интернет и настройки Supabase',
  footer_pre:'Служебная панель приемной комиссии ·', footer_link:'Академия гражданской защиты им. М. Габдуллина · МЧС РК'
},
kz:{
  brand_h:'Қабылдау комиссиясының панелі', brand_p:'М. Ғабдуллин атындағы Азаматтық қорғау академиясы · ҚР ТЖМ',
  lg_h:'Қабылдау комиссиясының панелі', lg_sub:'Қызметтік қолжетімділік. Тек Академияның қабылдау комиссиясы мүшелеріне арналған.',
  lg_l1:'Қызметтік логин', lg_l2:'Құпиясөз', lg_btn:'Панельге кіру', lg_demo:'Қызметтік қолжетімділік:',
  lg_e1:'Логин мен құпиясөзді енгізіңіз', lg_e2:'Логин немесе құпиясөз қате',
  nav_in:'Кіріс', nav_dash:'Жиынтық', nav_base:'Өтінімдер базасы', nav_fix:'Пысықтауда', nav_stages:'Кезеңдер', nav_appeals:'Өтініштер', nav_an:'Талдау', nav_exit:'Шығу',
  op_name:'Қабылдау комиссиясының қызметкері', op_role:'Комиссия мүшесі · жеке істерге толық қолжетімділік',
  in_h:'Талапкерлердің кіріс өтінімдері',
  in_sub:'Талапкерлердің кабинеттерінен түскен және комиссия әлі қарамаған өтінімдер. Құжаттарды тексеріп, шешім қабылдау үшін жеке істі ашыңыз.',
  in_empty:'Жаңа өтінім жоқ — түскен өтінімдердің барлығы қаралды',
  in_zero:'Әзірге өтінім жоқ. Талапкерлер өз кабинеттерінен құжаттарын жібергенде, олар осында автоматты пайда болады.',
  t_zero:'База бос — талапкерлерден әлі бірде-бір өтінім түскен жоқ',
  an_zero:'Талдау үшін әзірге дерек жоқ',
  in_note:'Өтінім талапкер жіберген сәтте осында автоматты пайда болады. Комиссия шешімі оның кабинетінде бірден көрінеді.',
  in_new:'Талапкерден жаңа өтінім түсті',
  ds_h:'Қабылдау науқанының жиынтығы', ds_sub:'Талапкерлер өтінімдерінің бірыңғай базасы. Базаны сүзу үшін көрсеткішті басыңыз.',
  k_all:'Барлық өтінім', k_review:'Қаралуда', k_fix:'Пысықтауда', k_appr:'Жіберілді', k_rej:'Бас тартылды',
  ds_q_h:'Бүгін назар аударуды қажет етеді', ds_l_h:'Талапкер кабинеттерімен алмасу журналы',
  bs_h:'Талапкерлер өтінімдерінің базасы', bs_sub:'Жеке істердің толықтығын автоматты талдау. Жолды бассаңыз — талапкердің жеке кабинеті құжаттарымен ашылады.',
  fl_search:'Іздеу', fl_search_ph:'Аты-жөні, ЖСН немесе іс №', fl_status:'Өтінім статусы', fl_region:'Өңір', fl_compl:'Толықтығы',
  o_all:'Барлығы', o_c_full:'Толық жинақ', o_c_part:'Толық емес жинақ', o_c_fix:'Ескертулер бар',
  t_case:'Іс №', t_app:'Талапкер', t_region:'Өңір', t_ent:'ҰБТ', t_compl:'Толықтығы', t_date:'Түскен күні',
  t_flags:'Ескертулер', t_status:'Статус', t_doc:'Құжат', t_cmt:'Комиссия ескертуі', t_act:'Әрекет', t_prob:'Мәселе',
  t_empty:'Берілген шарттар бойынша өтінім табылмады', t_recv:'түскен',
  fx_h:'Пысықтауға жіберілгендер', fx_sub:'Ескертуі бар жеке істер. Талапкер ескертуді өз кабинетінен көріп, түзетілген құжатты жүктейді.',
  fx_empty:'Ескертуі бар өтінім жоқ',
  an_h:'Құжаттар бойынша талдау', an_sub:'Талапкерлер қай құжатта жиі қателеседі және қай құжат жеке істің жинақталуын кешеуілдетеді.',
  an_1:'Түрлері бойынша қабылданған құжаттар үлесі', an_2:'Өңірлер бойынша өтінімдер', an_3:'Проблемалы құжаттар (ескерту және жоқтығы)',
  an_note:'Көрсеткіштер құжат статусы өзгерген сайын автоматты есептеледі.',
  an_4:'Қызметтік әрекеттер', an_reset:'Өтінімдер базасын тазарту',
  an_reset_p:'Барлық жеке істі базадан толық жою. Әрекет қайтарылмайды — талапкерлер деректері жоғалады.',
  an_reset2:'Барлық өтінімді жоюды растау', an_cancel:'Болдырмау',
  dc_view:'Файлды ашу', pv_dl:'Жүктеп алу', no_file:'файл жүктелмеген',
  pv_no:'Бұл формат үшін алдын ала қарау қолжетімсіз — файлды жүктеп алыңыз',
  b_ok:'қабылданды', b_wait:'тексерілуде', b_fix:'түзету қажет', b_none:'жүктелмеген',
  st_draft:'жоба', st_review:'қаралуда', st_fix:'пысықтауда', st_approved:'жіберілді', st_rejected:'бас тартылды',
  f_new:'жаңа', f_miss:'{n} құжат жоқ', f_fix:'{n} ескерту', f_full:'жинақ толық', f_ent_low:'ҰБТ шектен төмен', f_ent_no:'ҰБТ жоқ',
  open_case:'Істі ашу', dr_data:'Талапкер деректері', dr_docs:'Жеке іс құжаттары', dr_final:'Өтінім бойынша шешім', dr_stages:'Іріктеу кезеңдері', dr_log:'Тексеру тарихы',
  sb_ok:'өтті', sb_wait:'шешімді күтуде', sb_fail:'өтпеді', sb_lock:'қолжетімсіз',
  sb_accept:'Жіберу', sb_fail_btn:'Жібермеу', sb_reset:'Қарауға қайтару',
  sb_cmt_ph:'Комиссия түсініктемесі (себебі, міндетті)',
  sb_locked_doc:'Жеке іс құжаттары толық тексерілгеннен кейін ашылады',
  sb_locked_prev:'«{p}» кезеңінен сәтті өткеннен кейін ашылады',
  n_stage_ok:'«{s}» кезеңінен өтті', n_stage_fail:'«{s}» кезеңінен өтпеді. Себебі: {c}',
  lg_stage_ok:'кезеңнен өтті', lg_stage_fail:'кезеңнен өтпеді',
  sg2_h:'Талапкерлердің іріктеу кезеңдері',
  sg2_sub:'Жеке істің әр кезеңі бойынша комиссия шешімдері. Кезең құжаттар толық тексерілгеннен және алдыңғы кезеңнен сәтті өткеннен кейін автоматты ашылады.',
  sg2_empty:'Бұл кезеңде талапкер жоқ',
  ap_h:'Талапкерлер өтініштері', ap_sub:'Талапкерлердің жеке кабинеттерінен түскен деректерді өзгерту өтініштері.',
  ap_empty:'Жаңа өтініш жоқ', t_appeal_txt:'Өтініш мәтіні', ap_mark:'Қаралды деп белгілеу',
  ap_new:'Талапкерден жаңа өтініш түсті', ts_ap_seen:'Өтініш қаралды деп белгіленді',
  v_full_h:'Жеке іс толық жинақталған', v_full_p:'Барлық міндетті құжат қабылданды — өтінімді іріктеуге жіберуге болады.',
  v_part_h:'Жинақ толық емес', v_part_p:'{b} міндетті құжаттың {a} қабылданды. Жетіспейді: {m}',
  v_fix_h:'Ескертуі бар құжаттар бар', v_fix_p:'Ауыстыру қажет: {m}',
  v_wait_h:'Құжаттар тексеруді күтуде', v_wait_p:'{n} құжат тексерілуде. Файлдарды қарап, әрқайсысы бойынша шешім шығарыңыз.',
  v_draft_h:'Өтінім әлі берілмеген', v_draft_p:'Талапкер тіркелген, бірақ құжаттарын комиссияға жібермеген.',
  b_accept:'Қабылдау', b_remark:'Ескерту', b_reset:'Тексеруге қайтару',
  cmt_ph:'Талапкерге арналған ескерту мәтіні (міндетті)',
  fin_appr:'Іріктеуге жіберу', fin_fix:'Пысықтауға жіберу', fin_rej:'Жіберуден бас тарту', fin_reopen:'Қарауға қайтару',
  fin_note:'Шешім талапкердің жеке кабинетінде бірден көрінеді.',
  fin_block:'Жіберу мүмкін емес: міндетті құжаттар толық қабылданбаған.',
  rej_ph:'Бас тарту себебі (талапкерге көрінеді)', fix_all_ph:'Талапкер нені түзетуі керек',
  l_fio:'Аты-жөні', l_iin:'ЖСН', l_dob:'Туған күні', l_region:'Өңір', l_city:'Елді мекен', l_phone:'Телефон',
  l_ent:'ҰБТ балы', l_priv:'Жеңілдік санаты', l_sub:'Тапсырылған күні', ent_no:'ұсынылмаған', not_sent:'жіберілмеген',
  ent_ok:'✓ Сертификат базада расталды', ent_fake:'✗ Сертификат базадан табылмады — жалған болуы мүмкін',
  ent_score:'база бойынша балл', ent_mismatch:'⚠ Сертификаттағы балл тіркелу кезінде көрсетілгеннен өзгеше',
  ent_not_checked:'Талапкер сертификатты әлі базадан растаған жоқ', f_ent_fake:'ҰБТ сертификаты расталмаған',
  ts_ok:'Құжат қабылданды ✓', ts_fix:'Ескерту талапкерге жіберілді', ts_need:'Ескерту мәтінін енгізіңіз',
  ts_appr:'Өтінім іріктеуге жіберілді ✓', ts_rej:'Жіберуден бас тартылды', ts_fixall:'Іс пысықтауға жіберілді',
  ts_reopen:'Өтінім қарауға қайтарылды', ts_reset:'Құжат тексеруге қайтарылды', ts_bye:'Сеанс аяқталды',
  ts_reset_db:'Өтінімдер базасы тазартылды',
  n_ok:'Комиссия «{d}» құжатын қабылдады', n_fix:'Комиссия «{d}» құжатын түзетуге қайтарды: {c}',
  n_appr:'Өтінім іріктеудің келесі кезеңдеріне жіберілді', n_rej:'Комиссия жіберуден бас тартты. Себебі: {c}',
  n_fixall:'Жеке іс пысықтауға қайтарылды. {c}', n_reopen:'Өтінімді комиссия қарауға қайтарды',
  lg_doc_ok:'құжат қабылданды', lg_doc_fix:'құжат бойынша ескерту', lg_dec:'өтінім бойынша шешім',
  urg_none:'Шұғыл назар аударуды қажет ететін өтінім жоқ',
  sync_on:'Бұлттық база қосылған: барлық құрылғылардағы өтінімдер көрінеді', sync_off:'Бұлттық база қосылмаған: тек осы браузердің өтінімдері көрінеді', sync_wait:'Бұлттық базаға қосылуда…', sync_err:'Бұлттық базамен байланыс жоқ — интернетті және Supabase баптауларын тексеріңіз',
  footer_pre:'Қабылдау комиссиясының қызметтік панелі ·', footer_link:'М. Ғабдуллин атындағы Азаматтық қорғау академиясы · ҚР ТЖМ'
}};

let LANG='ru', OPENID=null, LOGGED=false, SELF=false, LASTIN=0, LASTAP=0;
function t(k){return (I18N[LANG][k] ?? I18N.ru[k] ?? k)}
function bi(ru,kz){return {ru,kz}}

/* Заявки, поданные абитуриентами (черновики в комиссию не попадают) */
function sent(){ return STORE.all().filter(a=>a.status!=='draft') }
function inboxList(){ return sent().filter(a=>!a.seen) }
/* Обращения абитуриентов об изменении данных (см. кабинет абитуриента) */
function appealsList(){
  const out=[];
  STORE.all().forEach(a=>(a.appeals||[]).forEach((ap,idx)=>{ if(!ap.seen) out.push({a,ap,idx}) }));
  return out;
}

function applyI18n(){
  document.documentElement.lang = LANG==='kz'?'kk':'ru';
  document.querySelectorAll('[data-i18n]').forEach(el=>el.textContent=t(el.dataset.i18n));
  document.querySelectorAll('[data-i18n-ph]').forEach(el=>el.placeholder=t(el.dataset.i18nPh));
  document.querySelectorAll('.lang-switch [data-lang]').forEach(b=>b.classList.toggle('on',b.dataset.lang===LANG));
  const on=document.getElementById('opName'); if(on)on.textContent=t('op_name');
  updateSyncNote();
  buildFilters(); renderAll();
  if(OPENID) renderCase();
}
function setLang(l){ LANG=l; try{ localStorage.setItem('agz_lang',l) }catch(e){} applyI18n() }

/* ================= Вход ================= */
function openPanel(){
  LOGGED=true; LASTIN=inboxList().length; LASTAP=appealsList().length;
  document.getElementById('loginScreen').style.display='none';
  document.getElementById('app').style.display='block';
  document.getElementById('opClock').textContent=stamp();
  applyI18n();
}
function doLogin(){
  const u=document.getElementById('lgUser').value.trim(), p=document.getElementById('lgPass').value.trim();
  const err=document.getElementById('lgErr');
  if(!u||!p){err.textContent=t('lg_e1');return}
  if(u!=='komissiya'||p!=='4455'){err.textContent=t('lg_e2');return}
  err.textContent='';
  try{ sessionStorage.setItem('agz_staff','1') }catch(e){}
  openPanel();
}
function logout(){
  closeCase(); LOGGED=false;
  try{ sessionStorage.removeItem('agz_staff') }catch(e){}
  document.getElementById('app').style.display='none';
  document.getElementById('loginScreen').style.display='block';
  document.getElementById('lgUser').value='';document.getElementById('lgPass').value='';
  toast(t('ts_bye'));
}

/* ================= Навигация ================= */
function go(p){
  document.querySelectorAll('#app .tab').forEach(s=>s.classList.toggle('active',s.id===p));
  document.querySelectorAll('#nav button[data-p]').forEach(b=>{ b.classList.toggle('active',b.dataset.p===p); if(b.dataset.p===p&&typeof centerTab==='function') centerTab(b) });
  const top=document.getElementById('app').getBoundingClientRect().top+window.scrollY-110;
  if(window.scrollY>top) window.scrollTo({top,behavior:'smooth'});
}
document.getElementById('nav').addEventListener('click',e=>{
  const b=e.target.closest('button[data-p]'); if(b)go(b.dataset.p);
});
function quick(s){document.getElementById('fStatus').value=s;renderBase();go('base')}

/* ================= Фильтры ================= */
function buildFilters(){
  const st=document.getElementById('fStatus'); if(!st)return;
  const keep={s:st.value,r:document.getElementById('fRegion').value,c:document.getElementById('fCompl').value};
  st.innerHTML=[['all','o_all'],['review','st_review'],['fix','st_fix'],['approved','st_approved'],['rejected','st_rejected']]
    .map(([v,k])=>`<option value="${v}">${t(k)}</option>`).join('');
  const regs=[...new Set(sent().map(a=>L(a.region)))];
  document.getElementById('fRegion').innerHTML=`<option value="all">${t('o_all')}</option>`+regs.map(r=>`<option value="${esc(r)}">${esc(r)}</option>`).join('');
  document.getElementById('fCompl').innerHTML=[['all','o_all'],['full','o_c_full'],['part','o_c_part'],['fix','o_c_fix']]
    .map(([v,k])=>`<option value="${v}">${t(k)}</option>`).join('');
  st.value=keep.s||'all';
  document.getElementById('fRegion').value=[...regs,'all'].includes(keep.r)?keep.r:'all';
  document.getElementById('fCompl').value=keep.c||'all';
}

/* ================= Рендер ================= */
const BLBL={ok:'b_ok',review:'b_wait',fix:'b_fix',none:'b_none'};
const SBLBL={ok:'sb_ok',review:'sb_wait',fix:'sb_fail',none:'sb_lock'};
function sBadge(a){ return `<span class="badge ${APP_BADGE[a.status]||'review'}">${t('st_'+a.status)}</span>` }
function mini(a){ return `<div class="mini"><div class="av">${esc(initials(L(a.fio)))}</div><div><b>${esc(L(a.fio))}</b><small>${esc(a.iin)}</small></div></div>` }
function openBtn(id){ return `<button class="btn btn--xs" onclick="event.stopPropagation();openCase('${id}')">${t('open_case')}</button>` }

function renderAll(){ if(!LOGGED)return; renderInbox();renderKpi();renderUrgent();renderLog();renderBase();renderFix();renderAn();renderStagesPanel();renderAppeals() }

function renderInbox(){
  const list=inboxList(), tb=document.getElementById('inboxBody'); tb.innerHTML='';
  const cnt=document.getElementById('inCount');
  cnt.textContent=list.length; cnt.className='ncount'+(list.length?' hot':'');
  list.forEach(a=>{
    const an=analyze(a), up=an.total-an.none, upct=Math.round(up/an.total*100);
    const tr=document.createElement('tr'); tr.className='row';
    tr.onclick=()=>openCase(a.id);
    tr.innerHTML=`<td><span class="case-id">${a.id}</span> <span class="rflag warn">${t('f_new')}</span></td>
      <td>${mini(a)}</td><td>${esc(L(a.region))}</td><td>${a.submitted||'—'}</td>
      <td><div class="bar"><i style="width:${upct}%"></i></div><div class="bar-lbl">${t('t_recv')}: ${up}/${an.total}</div></td>
      <td>${openBtn(a.id)}</td>`;
    tb.appendChild(tr);
  });
  const box=document.getElementById('inboxEmpty');
  box.style.display=list.length?'none':'block';
  box.textContent = sent().length ? t('in_empty') : t('in_zero');
  if(list.length<LASTIN)LASTIN=list.length;
}

function renderKpi(){
  const A=sent(), c=s=>A.filter(a=>a.status===s).length;
  document.getElementById('k1').textContent=A.length;
  document.getElementById('k2').textContent=c('review');
  document.getElementById('k3').textContent=c('fix');
  document.getElementById('k4').textContent=c('approved');
  document.getElementById('k5').textContent=c('rejected');
}

function flags(a){
  const an=analyze(a); let h='';
  if(!a.seen)h+=`<span class="rflag warn">${t('f_new')}</span>`;
  if(an.none)h+=`<span class="rflag">${t('f_miss').replace('{n}',an.none)}</span>`;
  if(an.fix)h+=`<span class="rflag">${t('f_fix').replace('{n}',an.fix)}</span>`;
  if(!a.ent)h+=`<span class="rflag warn">${t('f_ent_no')}</span>`;
  else if(a.ent<50)h+=`<span class="rflag">${t('f_ent_low')}</span>`;
  if(a.docs&&a.docs.d5&&a.docs.d5.entCheck==='fake')h+=`<span class="rflag">${t('f_ent_fake')}</span>`;
  if(!h)h=`<span class="rflag good">${t('f_full')}</span>`;
  return h;
}

function renderBase(){
  const fs=document.getElementById('fStatus').value, fr=document.getElementById('fRegion').value,
        fc=document.getElementById('fCompl').value, q=document.getElementById('fSearch').value.trim().toLowerCase();
  const rows=sent().filter(a=>{
    const an=analyze(a);
    if(fs!=='all'&&a.status!==fs)return false;
    if(fr!=='all'&&L(a.region)!==fr)return false;
    if(fc==='full'&&!an.filled)return false;
    if(fc==='part'&&an.none===0)return false;
    if(fc==='fix'&&an.fix===0)return false;
    if(q&&!(L(a.fio).toLowerCase().includes(q)||a.iin.includes(q)||a.id.toLowerCase().includes(q)))return false;
    return true;
  });
  const tb=document.getElementById('baseBody');tb.innerHTML='';
  rows.forEach(a=>{
    const an=analyze(a), tr=document.createElement('tr');tr.className='row'+(a.seen?'':' fresh');
    tr.onclick=()=>openCase(a.id);
    tr.innerHTML=`<td><span class="case-id">${a.id}</span></td><td>${mini(a)}</td><td>${esc(L(a.region))}</td>
      <td><b style="color:${!a.ent?'var(--muted-3)':(a.ent<50?'var(--red)':'var(--navy)')}">${a.ent||'—'}</b></td>
      <td><div class="bar"><i style="width:${an.pct}%"></i></div><div class="bar-lbl">${an.ok}/${an.total} · ${an.pct}%</div></td>
      <td>${flags(a)}</td><td>${sBadge(a)}</td>`;
    tb.appendChild(tr);
  });
  const be=document.getElementById('baseEmpty');
  be.style.display=rows.length?'none':'block';
  be.textContent = sent().length ? t('t_empty') : t('t_zero');
}

function renderUrgent(){
  const tb=document.getElementById('urgentBody');tb.innerHTML='';
  const list=sent().map(a=>({a,an:analyze(a)}))
    .filter(({a,an})=>a.status!=='approved'&&a.status!=='rejected'&&(an.review>0||an.fix>0||an.none>0))
    .sort((x,y)=>((y.a.seen?0:10)+y.an.fix+y.an.none)-((x.a.seen?0:10)+x.an.fix+x.an.none)).slice(0,5);
  if(!list.length){tb.innerHTML=`<tr><td colspan="3" class="empty">${t('urg_none')}</td></tr>`;return}
  list.forEach(({a})=>{
    const tr=document.createElement('tr');
    tr.innerHTML=`<td>${mini(a)}</td><td>${flags(a)}</td><td>${openBtn(a.id)}</td>`;
    tb.appendChild(tr);
  });
}

function renderFix(){
  const tb=document.getElementById('fixBody');tb.innerHTML='';let n=0;
  sent().forEach(a=>DOC_TYPES.forEach(d=>{
    const v=a.docs[d.id]||{s:'none'}; if(v.s!=='fix')return; n++;
    const tr=document.createElement('tr');
    tr.innerHTML=`<td><span class="case-id">${a.id}</span></td><td>${mini(a)}</td><td>${L(d)}</td>
      <td style="color:var(--red);font-weight:500">${esc(L(v.c))}</td><td>${openBtn(a.id)}</td>`;
    tb.appendChild(tr);
  }));
  document.getElementById('fixEmpty').style.display=n?'none':'block';
}

/* ---------- Отдельная панель «Этапы отбора»: своя таблица на каждый этап (s3..s7) ---------- */
function renderStagesPanel(){
  const box=document.getElementById('stagesPanelBody'); if(!box)return; box.innerHTML='';
  STAGE_TYPES.forEach((s,idx)=>{
    const rows=sent().filter(a=>stageAvailable(a,idx));
    const body=rows.length ? rows.map(a=>{
      const v=(a.stages&&a.stages[s.id])||{s:'none'};
      const cmt=L(v.c);
      const act=(v.s==='review'||v.s==='none')
        ? `<button class="btn btn--green btn--xs" onclick="event.stopPropagation();setStage('${s.id}','ok','${a.id}')">${t('sb_accept')}</button>
           <button class="btn btn--outline btn--xs" onclick="event.stopPropagation();failStageFromPanel('${a.id}','${s.id}')">${t('sb_fail_btn')}</button>`
        : `<button class="btn btn--outline btn--xs" onclick="event.stopPropagation();setStage('${s.id}','review','${a.id}')">${t('sb_reset')}</button>`;
      return `<tr class="row" onclick="openCase('${a.id}')">
        <td><span class="case-id">${a.id}</span></td><td>${mini(a)}</td>
        <td><span class="badge ${DOC_BADGE[v.s]}">${t(SBLBL[v.s])}</span>${cmt?`<div class="cmt ${v.s==='ok'?'ok':''}">${esc(cmt)}</div>`:''}</td>
        <td style="white-space:nowrap">${act}</td></tr>`;
    }).join('') : `<tr><td colspan="4" class="empty">${t('sg2_empty')}</td></tr>`;
    box.insertAdjacentHTML('beforeend', `<div class="panel mb-2">
      <div class="panel-head">${idx+3}. ${L(s)} <span class="tag" style="background:#fff;color:var(--navy)">${rows.length}</span></div>
      <div class="table-wrap" style="border-radius:0;box-shadow:none"><table class="rt"><thead><tr>
        <th>${t('t_case')}</th><th>${t('t_app')}</th><th>${t('t_status')}</th><th>${t('t_act')}</th>
      </tr></thead><tbody>${body}</tbody></table></div>
    </div>`);
  });
}
function failStageFromPanel(appId,stageId){
  openCase(appId);
  askFailStage(stageId);
}

/* ---------- Отдельная панель «Обращения абитуриентов» ---------- */
function renderAppeals(){
  const list=appealsList(), tb=document.getElementById('appealsBody'); if(!tb)return; tb.innerHTML='';
  const cnt=document.getElementById('apCount');
  if(cnt){ cnt.textContent=list.length; cnt.className='ncount'+(list.length?' hot':'') }
  list.forEach(({a,ap,idx})=>{
    const tr=document.createElement('tr');
    tr.innerHTML=`<td><span class="case-id">${a.id}</span></td><td>${mini(a)}</td>
      <td>${esc(ap.txt)}</td><td style="white-space:nowrap">${ap.dt}</td>
      <td style="white-space:nowrap">${openBtn(a.id)}
          <button class="btn btn--outline btn--xs" onclick="markAppealSeen('${a.id}',${idx})">${t('ap_mark')}</button></td>`;
    tb.appendChild(tr);
  });
  document.getElementById('appealsEmpty').style.display=list.length?'none':'block';
  if(list.length<LASTAP)LASTAP=list.length;
}
function markAppealSeen(appId,idx){
  editId(appId,(a)=>{ if(a.appeals&&a.appeals[idx]) a.appeals[idx].seen=true });
  toast(t('ts_ap_seen'));
}

function bar(nm,pct,vl){return `<div class="an-row"><div class="nm">${esc(nm)}</div><div class="bar"><i style="width:${pct}%"></i></div><div class="vl">${vl}</div></div>`}
function renderAn(){
  const A=sent(), N=Math.max(A.length,1);
  if(!A.length){
    ['anDocs','anRegions','anProblem'].forEach(id=>document.getElementById(id).innerHTML=`<div class="empty">${t('an_zero')}</div>`);
    return;
  }
  document.getElementById('anDocs').innerHTML=DOC_TYPES.map(d=>{
    const ok=A.filter(a=>(a.docs[d.id]||{s:'none'}).s==='ok').length;
    return bar(L(d),Math.round(ok/N*100),ok+'/'+A.length)}).join('');
  const regs={};A.forEach(a=>{const r=L(a.region);regs[r]=(regs[r]||0)+1});
  document.getElementById('anRegions').innerHTML=Object.entries(regs).sort((x,y)=>y[1]-x[1])
    .map(([r,n])=>bar(r,Math.round(n/N*100),n)).join('');
  const prob=DOC_TYPES.map(d=>({d,n:A.filter(a=>['fix','none'].includes((a.docs[d.id]||{s:'none'}).s)).length}))
    .filter(x=>x.n>0).sort((x,y)=>y.n-x.n);
  document.getElementById('anProblem').innerHTML=prob.map(x=>bar(L(x.d),Math.round(x.n/N*100),x.n)).join('')||`<div class="empty">—</div>`;
}

function renderLog(){
  const g=STORE.db().log||[], ul=document.getElementById('globalLog');
  ul.innerHTML=g.length?g.slice(0,10).map(l=>`<li>${esc(L(l.txt))}<time>${l.dt}</time></li>`).join('')
    :`<li style="color:var(--muted-3)">—</li>`;
}

/* ================= Личное дело ================= */
function openCase(id){
  const a=STORE.find(id);if(!a)return;
  OPENID=id;
  const hasUnseenAppeal=(a.appeals||[]).some(x=>!x.seen);
  if(!a.seen||hasUnseenAppeal){
    SELF=true;
    STORE.mutate(db=>{
      const r=db.applicants.find(x=>x.id===id);
      r.seen=true;
      (r.appeals||[]).forEach(x=>x.seen=true);
    });
    SELF=false;
  }
  document.getElementById('ov').classList.add('on');
  document.getElementById('drawer').classList.add('on');
  document.getElementById('drawer').scrollTop=0;
  renderCase(); renderAll();
}
function closeCase(){
  OPENID=null;
  document.getElementById('ov').classList.remove('on');
  document.getElementById('drawer').classList.remove('on');
}
function renderCase(){
  const a=STORE.find(OPENID); if(!a){closeCase();return}
  const an=analyze(a);
  document.getElementById('drAva').textContent=initials(L(a.fio));
  document.getElementById('drName').textContent=L(a.fio);
  document.getElementById('drCase').textContent=`${a.id} · ${a.iin} · ${L(a.region)}`;

  let vc,vh,vp;
  if(a.status==='draft'){vc='';vh=t('v_draft_h');vp=t('v_draft_p')}
  else if(an.fix){vc='bad';vh=t('v_fix_h');vp=t('v_fix_p').replace('{m}',an.broken.map(d=>L(d)).join(', '))}
  else if(an.none){vc='';vh=t('v_part_h');vp=t('v_part_p').replace('{a}',an.ok).replace('{b}',an.total).replace('{m}',an.missing.map(d=>L(d)).join(', '))}
  else if(an.review){vc='';vh=t('v_wait_h');vp=t('v_wait_p').replace('{n}',an.review)}
  else {vc='ok';vh=t('v_full_h');vp=t('v_full_p')}

  const kv=[['l_fio',L(a.fio)],['l_iin',a.iin],['l_dob',a.dob],['l_phone',a.phone],
            ['l_region',L(a.region)],['l_city',L(a.city)],
            ['l_ent',a.ent?String(a.ent):t('ent_no')],
            ['l_priv',L(a.priv)],['l_sub',a.submitted||t('not_sent')]]
    .map(([k,v])=>`<div><dt>${t(k)}</dt><dd>${esc(v)}</dd></div>`).join('');

  const docs=docsOf(a).map(({t:d,v})=>{
    const cmt=L(v.c);
    const act=(v.s==='review'||v.s==='none')
      ? `<div class="drow-act">
           <button class="btn btn--green btn--xs" onclick="setDoc('${d.id}','ok')">✓ ${t('b_accept')}</button>
           <button class="btn btn--outline btn--xs" onclick="askFix('${d.id}')">✎ ${t('b_remark')}</button></div>`
      : `<div class="drow-act"><button class="btn btn--outline btn--xs" onclick="setDoc('${d.id}','review')">${t('b_reset')}</button></div>`;
    /* --- статус проверки сертификата ЕНТ по базе (только d5) --- */
    let ent='';
    if(d.id==='d5' && v.f){
      if(v.entCheck==='ok'){
        const mism = v.entScore!=null && a.ent && Number(a.ent)!==Number(v.entScore);
        ent=`<div class="ent-box ent-ok"><b>${t('ent_ok')}</b> · №${esc(v.entNum)} · ${t('ent_score')}: ${v.entScore}
             ${mism?`<div class="ent-warn">${t('ent_mismatch')}</div>`:''}</div>`;
      } else if(v.entCheck==='fake'){
        ent=`<div class="ent-box ent-fake"><b>${t('ent_fake')}</b> · №${esc(v.entNum)}</div>`;
      } else {
        ent=`<div class="ent-box ent-pend">${t('ent_not_checked')}</div>`;
      }
    }
    return `<div class="drow s-${v.s}">
      <div class="drow-t"><b>${L(d)}</b><span class="badge ${DOC_BADGE[v.s]}">${t(BLBL[v.s])}</span></div>
      ${v.f?`<small>📄 ${esc(v.f)}${v.size?' · '+fsize(v.size):''} · ${v.dt}
             ${v.fid?`<button class="lnk" onclick="openFile('${v.fid}')">${t('dc_view')}</button>`:''}</small>`
           :`<small style="opacity:.7">${t('no_file')}</small>`}
      ${ent}
      ${cmt?`<div class="cmt ${v.s==='ok'?'ok':''}">${esc(cmt)}</div>`:''}${act}</div>`;
  }).join('');

  const canAppr=an.complete;
  const fin=`<div class="final">
      <button class="btn btn--green" ${canAppr?'':'disabled'} onclick="decide('approved')">${t('fin_appr')}</button>
      <button class="btn btn--outline" onclick="askDecide('fix')">${t('fin_fix')}</button>
      <button class="btn btn--danger" onclick="askDecide('rejected')">${t('fin_rej')}</button>
      ${(a.status==='approved'||a.status==='rejected')?`<button class="btn btn--light" onclick="decide('review')">${t('fin_reopen')}</button>`:''}
    </div>
    <div id="decBox"></div>
    <div class="alert ${canAppr?'info':'warn'} mt-1"><span>${canAppr?'ℹ️':'⚠️'}</span><div>${canAppr?t('fin_note'):t('fin_block')}</div></div>`;

  /* --- отдельный блок на каждый этап отбора (s3..s7) --- */
  const stg=stagesOf(a).map(({t:s,v,idx})=>{
    const avail=stageAvailable(a,idx);
    const st=avail?v.s:'none';
    const cmt=L(v.c);
    let act='';
    if(avail){
      act=(st==='review'||st==='none')
        ? `<div class="drow-act">
             <button class="btn btn--green btn--xs" onclick="setStage('${s.id}','ok')">${t('sb_accept')}</button>
             <button class="btn btn--outline btn--xs" onclick="askFailStage('${s.id}')">${t('sb_fail_btn')}</button></div>`
        : `<div class="drow-act"><button class="btn btn--outline btn--xs" onclick="setStage('${s.id}','review')">${t('sb_reset')}</button></div>`;
    }
    const lock=!avail?`<small>${idx===0?t('sb_locked_doc'):t('sb_locked_prev').replace('{p}',L(STAGE_TYPES[idx-1]))}</small>`:'';
    return `<div class="drow s-${st}">
        <div class="drow-t"><b>${idx+3}. ${L(s)}</b><span class="badge ${DOC_BADGE[st]}">${t(SBLBL[st])}</span></div>
        ${lock}
        ${cmt?`<div class="cmt ${st==='ok'?'ok':''}">${esc(cmt)}</div>`:''}
        ${act}
      </div>`;
  }).join('');

  const log=(a.log||[]).length?`<ul class="log sm">${a.log.map(l=>`<li>${esc(L(l.txt))}<time>${l.dt}</time></li>`).join('')}</ul>`
    :`<div class="empty" style="padding:14px">—</div>`;

  document.getElementById('drBody').innerHTML=`
    <div class="verdict-box ${vc}"><b>${vh}</b><span>${esc(vp)}</span></div>
    <div style="display:flex;gap:10px;align-items:center;margin-bottom:6px">
      ${sBadge(a)}<div class="bar" style="flex:1"><i style="width:${an.pct}%"></i></div><b style="color:var(--navy)">${an.pct}%</b></div>
    <div class="sect-h">${t('dr_data')}</div><div class="card"><dl class="kv">${kv}</dl></div>
    <div class="sect-h">${t('dr_docs')}</div>${docs}
    <div class="sect-h">${t('dr_final')}</div>${fin}
    <div class="sect-h">${t('dr_stages')}</div>${stg}
    <div class="sect-h">${t('dr_log')}</div><div class="card">${log}</div>`;
}

/* --- изменения пишутся в общую базу и уходят в кабинет абитуриента --- */
function editId(id,fn){
  SELF=true;
  STORE.mutate(db=>{ const a=db.applicants.find(x=>x.id===id); if(a) fn(a,db) });
  SELF=false;
  renderAll(); if(OPENID===id) renderCase();
}
function edit(fn){ editId(OPENID,fn) }
function push(a,db,noteRu,noteKz,logRu,logKz){
  a.notes.unshift({txt:bi(noteRu,noteKz),dt:stamp(),n:1});
  a.log.unshift({txt:bi(logRu,logKz),dt:stamp()});
  db.log.unshift({txt:bi(`${a.id} — ${logRu}`,`${a.id} — ${logKz}`),dt:stamp()});
}

function setDoc(id,st){
  const d=DOC_TYPES.find(x=>x.id===id);
  edit((a,db)=>{
    const v=a.docs[id]||{s:'none'};
    if(st==='ok'){
      a.docs[id]={...v,s:'ok',f:v.f||(id.toUpperCase()+'.pdf'),dt:v.dt||today(),c:bi('без замечаний','ескертусіз')};
      push(a,db, I18N.ru.n_ok.replace('{d}',d.ru), I18N.kz.n_ok.replace('{d}',d.kz),
                 `${I18N.ru.lg_doc_ok}: ${d.ru}`, `${I18N.kz.lg_doc_ok}: ${d.kz}`);
    } else {
      a.docs[id]={...v,s:'review',c:null};
    }
  });
  toast(st==='ok'?t('ts_ok'):t('ts_reset'));
}

/* Форма с комментарием внутри карточки дела */
function inlineForm(title,taId,ph,btnCls,btnTxt,onApply,warn){
  const w=document.createElement('div');
  w.className='card inline-form'+(warn?' warn':'');
  w.innerHTML=`<h3 style="font-size:16px">${title}</h3>
    <textarea id="${taId}" placeholder="${ph}"></textarea>
    <div class="drow-act">
      <button class="btn ${btnCls} btn--sm" onclick="${onApply}">${btnTxt}</button>
      <button class="btn btn--outline btn--sm" onclick="renderCase()">✕</button></div>`;
  return w;
}
function askFix(id){
  const d=DOC_TYPES.find(x=>x.id===id);
  const w=inlineForm(`${t('b_remark')}: ${L(d)}`,'fixTxt',t('cmt_ph'),'btn--danger',t('b_remark'),`applyFix('${id}')`);
  document.getElementById('drBody').appendChild(w);
  w.scrollIntoView({behavior:'smooth',block:'center'});
  document.getElementById('fixTxt').focus();
}
function applyFix(id){
  const txt=document.getElementById('fixTxt').value.trim();
  if(!txt){toast(t('ts_need'));return}
  const d=DOC_TYPES.find(x=>x.id===id);
  edit((a,db)=>{
    const v=a.docs[id]||{s:'none'};
    a.docs[id]={...v,s:'fix',c:bi(txt,txt)};
    if(a.status==='review')a.status='fix';
    push(a,db, I18N.ru.n_fix.replace('{d}',d.ru).replace('{c}',txt),
               I18N.kz.n_fix.replace('{d}',d.kz).replace('{c}',txt),
               `${I18N.ru.lg_doc_fix}: ${d.ru}`, `${I18N.kz.lg_doc_fix}: ${d.kz}`);
  });
  toast(t('ts_fix'));
}

/* --- решения комиссии по этапам отбора (s3..s7) --- */
function setStage(id,st,appId){
  appId=appId||OPENID;
  const s=STAGE_TYPES.find(x=>x.id===id);
  editId(appId,(a,db)=>{
    if(!a.stages) a.stages={};
    const v=a.stages[id]||{s:'none'};
    if(st==='ok'){
      a.stages[id]={...v,s:'ok',dt:today(),c:null};
      push(a,db, I18N.ru.n_stage_ok.replace('{s}',s.ru), I18N.kz.n_stage_ok.replace('{s}',s.kz),
                 `${I18N.ru.lg_stage_ok}: ${s.ru}`, `${I18N.kz.lg_stage_ok}: ${s.kz}`);
    } else {
      a.stages[id]={...v,s:'review',c:null};
    }
  });
  toast(st==='ok'?t('ts_ok'):t('ts_reset'));
}
function askFailStage(id){
  const s=STAGE_TYPES.find(x=>x.id===id);
  const w=inlineForm(`${t('sb_fail_btn')}: ${L(s)}`,'stageFixTxt',t('sb_cmt_ph'),'btn--danger',t('sb_fail_btn'),`applyFailStage('${id}')`);
  document.getElementById('drBody').appendChild(w);
  w.scrollIntoView({behavior:'smooth',block:'center'});
  document.getElementById('stageFixTxt').focus();
}
function applyFailStage(id){
  const txt=document.getElementById('stageFixTxt').value.trim();
  if(!txt){toast(t('ts_need'));return}
  const s=STAGE_TYPES.find(x=>x.id===id);
  edit((a,db)=>{
    if(!a.stages) a.stages={};
    const v=a.stages[id]||{s:'none'};
    a.stages[id]={...v,s:'fix',c:bi(txt,txt)};
    push(a,db, I18N.ru.n_stage_fail.replace('{s}',s.ru).replace('{c}',txt),
               I18N.kz.n_stage_fail.replace('{s}',s.kz).replace('{c}',txt),
               `${I18N.ru.lg_stage_fail}: ${s.ru}`, `${I18N.kz.lg_stage_fail}: ${s.kz}`);
  });
  toast(t('ts_fix'));
}

/* --- итоговое решение по заявке --- */
function askDecide(st){
  const rej=st==='rejected';
  const box=document.getElementById('decBox'); box.innerHTML='';
  const w=inlineForm(rej?t('fin_rej'):t('fin_fix'),'decTxt',rej?t('rej_ph'):t('fix_all_ph'),
    rej?'btn--danger':'',rej?t('fin_rej'):t('fin_fix'),`decide('${st}')`,!rej);
  w.querySelector('.btn--outline').setAttribute('onclick',"document.getElementById('decBox').innerHTML=''");
  box.appendChild(w);
  const ta=document.getElementById('decTxt'); ta.focus();
  ta.scrollIntoView({behavior:'smooth',block:'center'});
}
function decide(st){
  const a=STORE.find(OPENID), an=analyze(a);
  if(st==='approved'&&!an.complete){toast(t('fin_block'));return}
  const ta=document.getElementById('decTxt');
  const reason=ta?ta.value.trim():'';
  if((st==='rejected'||st==='fix')&&!reason){toast(t('ts_need'));return}
  edit((r,db)=>{
    r.status=st;
    if(st==='approved') push(r,db,I18N.ru.n_appr,I18N.kz.n_appr,
        `${I18N.ru.lg_dec}: ${I18N.ru.fin_appr}`,`${I18N.kz.lg_dec}: ${I18N.kz.fin_appr}`);
    if(st==='rejected') push(r,db,I18N.ru.n_rej.replace('{c}',reason),I18N.kz.n_rej.replace('{c}',reason),
        `${I18N.ru.lg_dec}: ${I18N.ru.fin_rej}`,`${I18N.kz.lg_dec}: ${I18N.kz.fin_rej}`);
    if(st==='fix')      push(r,db,I18N.ru.n_fixall.replace('{c}',reason),I18N.kz.n_fixall.replace('{c}',reason),
        `${I18N.ru.lg_dec}: ${I18N.ru.fin_fix}`,`${I18N.kz.lg_dec}: ${I18N.kz.fin_fix}`);
    if(st==='review')   push(r,db,I18N.ru.n_reopen,I18N.kz.n_reopen,
        `${I18N.ru.lg_dec}: ${I18N.ru.fin_reopen}`,`${I18N.kz.lg_dec}: ${I18N.kz.fin_reopen}`);
  });
  toast(t({approved:'ts_appr',fix:'ts_fixall',rejected:'ts_rej',review:'ts_reopen'}[st]));
}

function resetAsk(){
  document.getElementById('resetBox').innerHTML=
    `<div class="drow-act" style="margin-top:12px">
       <button class="btn btn--danger btn--sm" onclick="resetAll()">${t('an_reset2')}</button>
       <button class="btn btn--outline btn--sm" onclick="document.getElementById('resetBox').innerHTML=''">${t('an_cancel')}</button>
     </div>`;
}
function resetAll(){
  STORE.all().forEach(a=>Object.values(a.docs||{}).forEach(v=>{ if(v.fid)FILES.del(v.fid) }));
  STORE.wipe(); LASTIN=0; LASTAP=0; closeCase();
  document.getElementById('resetBox').innerHTML='';
  renderAll(); toast(t('ts_reset_db'));
}

/* ============ ПРОСМОТР ДОКУМЕНТА, ЗАГРУЖЕННОГО АБИТУРИЕНТОМ ============ */
async function openFile(fid){
  const rec=await FILES.get(fid); if(!rec)return;
  const url=URL.createObjectURL(rec.blob);
  document.getElementById('pvName').textContent=rec.name;
  document.getElementById('pvMeta').textContent=fsize(rec.size);
  const dl=document.getElementById('pvDl'); dl.href=url; dl.setAttribute('download',rec.name);
  const body=document.getElementById('pvBody');
  if(/^image\//.test(rec.type||'')) body.innerHTML=`<img src="${url}" alt="">`;
  else if((rec.type||'')==='application/pdf'||/\.pdf$/i.test(rec.name)) body.innerHTML=`<iframe src="${url}"></iframe>`;
  else body.innerHTML=`<div class="pv-non">${t('pv_no')}</div>`;
  document.getElementById('pv').classList.add('on');
}
function closePv(e){
  if(e&&e.type==='click'&&e.target&&e.target.closest&&e.target.closest('.pv-box'))return;
  document.getElementById('pv').classList.remove('on');
  document.getElementById('pvBody').innerHTML='';
}

/* ============ ЖИВОЕ ОБНОВЛЕНИЕ ИЗ КАБИНЕТОВ АБИТУРИЕНТОВ ============ */
STORE.onChange(()=>{
  if(!LOGGED||SELF)return;
  const n=inboxList().length;
  if(n>LASTIN) toast(t('in_new'));
  LASTIN=n;
  const na=appealsList().length;
  if(na>LASTAP) toast(t('ap_new'));
  LASTAP=na;
  buildFilters(); renderAll(); if(OPENID)renderCase();
});

document.addEventListener('keydown',e=>{
  if(e.key!=='Escape')return;
  if(document.getElementById('pv').classList.contains('on')) closePv(); else closeCase();
});

/* ================= Запуск ================= */
try{ const s=localStorage.getItem('agz_lang'); if(s==='ru'||s==='kz') LANG=s }catch(e){}
applyI18n();
try{ if(sessionStorage.getItem('agz_staff')==='1') STORE.ready().then(openPanel) }catch(e){}
