
import { SchoolData, Gender, ScholarshipRank, ProspectLevel, RecruitmentResult } from './types';

export const CLUBS = [
  '剣道',
  '柔道',
  'サッカー',
  '野球',
  '卓球',
  '女子バレーボール',
  'バスケットボール',
  '駅伝',
  '山岳',
  'ソフトテニス',
  '書道',
  '将棋',
  '吹奏楽',
  'ダンス',
  'フェンシング',
  'その他'
];

export const RECRUITERS = [
  '校長',
  '萩谷教頭',
  '越川教頭',
  'その他'
];

// Comprehensive School Database based on provided data
export const INITIAL_SCHOOL_DATABASE: SchoolData[] = [
  { code: '1', name: '水戸一', municipality: '水戸市', phone: '029-224-2424', principal: '瀧　健一', headTeacher: '篠原・遠藤' },
  { code: '2', name: '水戸二', municipality: '水戸市', phone: '029-224-4422', principal: '藤枝　祥子', headTeacher: '松山・栁内' },
  { code: '3', name: '水戸三', municipality: '水戸市', phone: '029-224-5508', principal: '鎮目　英俊', headTeacher: '澤畑・斎藤' },
  { code: '4', name: '緑岡', municipality: '水戸市', phone: '029-241-1069', principal: '矢口　智之', headTeacher: '栗原・大内' },
  { code: '5', name: '水戸四', municipality: '水戸市', phone: '029-247-5554', principal: '蓮沼　邦彦', headTeacher: '田中・菊池' },
  { code: '6', name: '飯富', municipality: '水戸市', phone: '029-229-7132', principal: '日渡　義典', headTeacher: '石川' },
  { code: '7', name: '国田', municipality: '水戸市', phone: '029-239-7125', principal: '森田　理恵子', headTeacher: '鴨志田' },
  { code: '8', name: '赤塚', municipality: '水戸市', phone: '029-251-9435', principal: '石川　聡', headTeacher: '春山・長山' },
  { code: '9', name: '水戸五', municipality: '水戸市', phone: '029-251-1414', principal: '興野　庄一', headTeacher: '小林・番場' },
  { code: '10', name: '見川', municipality: '水戸市', phone: '029-241-2309', principal: '岡村　直之', headTeacher: '黒鳥・石崎' },
  { code: '11', name: '双葉台', municipality: '水戸市', phone: '029-253-1861', principal: '大内　邦明', headTeacher: '平・谷貝' },
  { code: '12', name: '笠原', municipality: '水戸市', phone: '029-241-5363', principal: '朝日　広一', headTeacher: '本城・中谷' },
  { code: '13', name: '石川', municipality: '水戸市', phone: '029-254-1700', principal: '小林　克行', headTeacher: '髙瀬・田山' },
  { code: '14', name: '千波', municipality: '水戸市', phone: '029-248-4080', principal: '斎田　由加理', headTeacher: '寺山・小林' },
  { code: '15', name: '常澄', municipality: '水戸市', phone: '029-269-2116', principal: '中根　泰司', headTeacher: '太田・古平' },
  { code: '16', name: '内原', municipality: '水戸市', phone: '029-259-2032', principal: '山本　一典', headTeacher: '國藤・箱田' },
  { code: '17', name: '笠間', municipality: '笠間市', phone: '0296-72-0120', principal: '持丸　正美', headTeacher: '福地・大出' },
  { code: '18', name: '笠間南', municipality: '笠間市', phone: '0296-72-1385', principal: '小森　真史', headTeacher: '野口' },
  { code: '19', name: '稲田', municipality: '笠間市', phone: '0296-74-2004', principal: '安蔵　明弘', headTeacher: '岡野・滝原' },
  { code: '20', name: '友部', municipality: '笠間市', phone: '0296-77-0073', principal: '常井　裕二', headTeacher: '間宮・大森' },
  { code: '21', name: '友部二', municipality: '笠間市', phone: '0296-77-7809', principal: '玉渕　智巳', headTeacher: '馬場・滑川' },
  { code: '22', name: '岩間', municipality: '笠間市', phone: '0299-45-2624', principal: '野尻　秀子', headTeacher: '天笠・久野' },
  { code: '23', name: '那珂湊', municipality: 'ひたちなか市', phone: '029-262-4349', principal: '澤畑　孝也', headTeacher: '宇佐美・桐原' },
  { code: '24', name: '美乃浜', municipality: 'ひたちなか市', phone: '029-212-9311', principal: '中原　悟', headTeacher: '市毛・曾田' },
  { code: '26', name: '勝田一', municipality: 'ひたちなか市', phone: '029-272-2416', principal: '飯村　祐一', headTeacher: '大森・瀬谷' },
  { code: '27', name: '勝田二', municipality: 'ひたちなか市', phone: '029-272-2624', principal: '豊田　敬慈', headTeacher: 'なかにわ' },
  { code: '28', name: '勝田三', municipality: 'ひたちなか市', phone: '029-272-5215', principal: '川上　徹行', headTeacher: '鈴木・小澤' },
  { code: '29', name: '佐野', municipality: 'ひたちなか市', phone: '029-285-0207', principal: '𠮷田　行博', headTeacher: '松下・金子' },
  { code: '30', name: '大島', municipality: 'ひたちなか市', phone: '029-272-3930', principal: '朝比奈　泰浩', headTeacher: '磯﨑・齊藤' },
  { code: '31', name: '田彦', municipality: 'ひたちなか市', phone: '029-274-9383', principal: '水谷　聖美', headTeacher: '大内・綿引' },
  { code: '32', name: '大宮', municipality: '常陸大宮市', phone: '0295-52-0068', principal: '河野　護', headTeacher: '田所・海野' },
  { code: '33', name: '大宮二', municipality: '常陸大宮市', phone: '0295-52-0561', principal: '関　典由', headTeacher: '飛田・蓮沼' },
  { code: '34', name: '山方', municipality: '常陸大宮市', phone: '0295-57-2802', principal: '山田　勝一', headTeacher: '三村・川和' },
  { code: '35', name: '明峰', municipality: '常陸大宮市', phone: '0295-56-2004', principal: '清水　恭子', headTeacher: '東條' },
  { code: '37', name: '那珂一', municipality: '那珂市', phone: '029-298-0040', principal: '田所　秀紀', headTeacher: '草地・小池' },
  { code: '38', name: '那珂二', municipality: '那珂市', phone: '029-298-1045', principal: '朝比奈　佐智代', headTeacher: '大和田・住谷' },
  { code: '39', name: '那珂三', municipality: '那珂市', phone: '029-298-1128', principal: '海老根　健治', headTeacher: '川又・柏' },
  { code: '40', name: '那珂四', municipality: '那珂市', phone: '029-298-8767', principal: '沼田　義博', headTeacher: '加倉井・田村' },
  { code: '41', name: '瓜連', municipality: '那珂市', phone: '029-296-0049', principal: '圷　丈央', headTeacher: '永井・中村' },
  { code: '42', name: '小川南', municipality: '小美玉市', phone: '0299-58-2444', principal: '荘司　宏征', headTeacher: '長谷川' },
  { code: '43', name: '小川北', municipality: '小美玉市', phone: '0299-58-2544', principal: '石﨑　重臣', headTeacher: '矢口' },
  { code: '44', name: '美野里', municipality: '小美玉市', phone: '0299-48-0128', principal: '高木　克己', headTeacher: '蛭田・豊田' },
  { code: '45', name: '玉里', municipality: '小美玉市', phone: '0299-58-2555', principal: '井元　潤一', headTeacher: '篠崎' },
  { code: '46', name: '明光', municipality: '東茨城郡茨城町', phone: '029-292-0154', principal: '中山　和彦', headTeacher: '樋口・久保田' },
  { code: '47', name: '青葉', municipality: '東茨城郡茨城町', phone: '029-292-0222', principal: '林　真敏', headTeacher: '酒葉・大枝' },
  { code: '48', name: '大洗一', municipality: '東茨城郡大洗町', phone: '029-267-5288', principal: '岩城　和久', headTeacher: '保田' },
  { code: '49', name: '大洗南', municipality: '東茨城郡大洗町', phone: '029-267-2942', principal: '宇陀　定司', headTeacher: '川﨑' },
  { code: '50', name: '城里町常北', municipality: '東茨城郡城里町', phone: '029-288-2025', principal: '鈴木　勝', headTeacher: '藤沼・佐藤' },
  { code: '51', name: '桂', municipality: '東茨城郡城里町', phone: '029-289-2052', principal: '柳橋　輝広', headTeacher: '津田・渡部' },
  { code: '52', name: '東海', municipality: '那珂郡東海村', phone: '029-282-1625', principal: '野上幸広', headTeacher: '武田・横山' },
  { code: '53', name: '東海南', municipality: '那珂郡東海村', phone: '029-282-7821', principal: '正木　啓道', headTeacher: '有賀・川野' },
  { code: '54', name: '大子', municipality: '久慈郡大子町', phone: '02957-2-0158', principal: '益子　直之', headTeacher: '桐原・岩瀬' },
  { code: '55', name: '生瀬', municipality: '久慈郡大子町', phone: '02957-6-0006', principal: '編集中！', headTeacher: '編集中！' },
  { code: '56', name: '大子西', municipality: '久慈郡大子町', phone: '02957-2-9035', principal: '編集中！', headTeacher: '編集中！' },
  { code: '57', name: '大子南', municipality: '久慈郡大子町', phone: '02957-4-0024', principal: '編集中！', headTeacher: '編集中！' },
  { code: '58', name: '助川', municipality: '日立市', phone: '0294-22-5348', principal: '藤田　剛', headTeacher: '宮田・岡田' },
  { code: '59', name: '平沢', municipality: '日立市', phone: '0294-22-4139', principal: '編集中！', headTeacher: '編集中！' },
  { code: '60', name: '駒王', municipality: '日立市', phone: '0294-22-5341', principal: '松原　浩太郎', headTeacher: '大和田・石川' },
  { code: '61', name: '多賀', municipality: '日立市', phone: '0294-36-0533', principal: '藤谷　真一', headTeacher: '酒井・五耒' },
  { code: '62', name: '大久保', municipality: '日立市', phone: '0294-33-1164', principal: '小柳　隆弘', headTeacher: '星・矢嶋' },
  { code: '63', name: '泉丘', municipality: '日立市', phone: '0294-52-2757', principal: '多田　賢一', headTeacher: '田仲・門三野' },
  { code: '64', name: '日高', municipality: '日立市', phone: '0294-42-4418', principal: '芳賀　俊英', headTeacher: '横倉・緑川' },
  { code: '66', name: '松風', municipality: '日立市', phone: '0294-52-3242', principal: '小室　弘毅', headTeacher: '大森・三浦' },
  { code: '67', name: '中里', municipality: '日立市', phone: '0294-59-0344', principal: '荒蒔　克一郎', headTeacher: '吉村・佐藤' },
  { code: '68', name: '豊浦', municipality: '日立市', phone: '0294-43-5719', principal: '金澤　勝也', headTeacher: '髙橋' },
  { code: '69', name: '河原子', municipality: '日立市', phone: '0294-36-0532', principal: '木村　剛', headTeacher: '鈴木' },
  { code: '70', name: '台原', municipality: '日立市', phone: '0294-34-6601', principal: '横山　勉', headTeacher: '鈴木・園部' },
  { code: '71', name: '滑川', municipality: '日立市', phone: '0294-24-7034', principal: '根本　伸一', headTeacher: '戸邊・矢田部' },
  { code: '72', name: '十王', municipality: '日立市', phone: '0294-39-2400', principal: '岡村　克明', headTeacher: '岡田・佐藤' },
  { code: '73', name: '太田', municipality: '常陸太田市', phone: '0294-72-1120', principal: '田所　俊哉', headTeacher: '柴田・大貫' },
  { code: '74', name: '世矢', municipality: '常陸太田市', phone: '0294-74-3093', principal: '編集中！', headTeacher: '編集中！' },
  { code: '75', name: '峰山', municipality: '常陸太田市', phone: '0294-72-6222', principal: '和田　秀彦', headTeacher: '小田部' },
  { code: '76', name: '瑞竜', municipality: '常陸太田市', phone: '0294-72-1130', principal: '佐藤　貴久', headTeacher: '清水・福田' },
  { code: '77', name: '金砂郷', municipality: '常陸太田市', phone: '0294-76-2004', principal: '岡部　英昭', headTeacher: '沼野・滑澤' },
  { code: '78', name: '水府', municipality: '常陸太田市', phone: '0294-85-1141', principal: '平澤　一彦', headTeacher: '会沢・馬場' },
  { code: '79', name: '里美', municipality: '常陸太田市', phone: '0294-82-2008', principal: '圷　聡美', headTeacher: '薄井' },
  { code: '80', name: '高萩', municipality: '高萩市', phone: '0293-22-3147', principal: '藤田　洋', headTeacher: '中村・金野' },
  { code: '81', name: '松岡', municipality: '高萩市', phone: '0293-22-2431', principal: '小堀　隆弘', headTeacher: '上野' },
  { code: '82', name: '秋山', municipality: '高萩市', phone: '0293-22-2760', principal: '長谷川　範雄', headTeacher: '竹内・井上' },
  { code: '83', name: '中郷', municipality: '北茨城市', phone: '0293-42-1175', principal: '小泉　一彦', headTeacher: '渡部・芳賀' },
  { code: '84', name: '磯原', municipality: '北茨城市', phone: '0293-42-0116', principal: '松崎　善則', headTeacher: '村松・隈崎' },
  { code: '86', name: '北茨城常北', municipality: '北茨城市', phone: '0293-46-0201', principal: '横倉　浩樹', headTeacher: '作間・鈴木' },
  { code: '87', name: '関本', municipality: '北茨城市', phone: '0293-46-0363', principal: '関根　紀夫', headTeacher: '澤田・小野' },
  { code: '88', name: '大野', municipality: '鹿嶋市', phone: '0299-69-0023', principal: '寺内　久永', headTeacher: '佐藤・齋藤' },
  { code: '89', name: '鹿島', municipality: '鹿嶋市', phone: '0299-82-1455', principal: '内野', headTeacher: '佐藤・江原' },
  { code: '90', name: '高松', municipality: '鹿嶋市', phone: '0299-82-1545', principal: '編集中！', headTeacher: '編集中！' },
  { code: '91', name: '鹿野', municipality: '鹿嶋市', phone: '0299-83-6621', principal: '太田　雄介', headTeacher: '小沼・塚本' },
  { code: '92', name: '平井', municipality: '鹿嶋市', phone: '0299-83-6671', principal: '遠藤　芳輝', headTeacher: '本宮・白井' },
  { code: '93', name: '潮来一', municipality: '潮来市', phone: '0299-62-2334', principal: '編集中！', headTeacher: '編集中！' },
  { code: '94', name: '潮来二', municipality: '潮来市', phone: '0299-66-2344', principal: '額賀　英彦', headTeacher: '敦賀' },
  { code: '95', name: '日の出', municipality: '潮来市', phone: '0299-66-5852', principal: '大輪　和彦', headTeacher: '橋本・永野' },
  { code: '96', name: '牛堀', municipality: '潮来市', phone: '0299-64-2231', principal: '小松崎　弘樹', headTeacher: '門井' },
  { code: '97', name: '神栖一', municipality: '神栖市', phone: '0299-96-0302', principal: '横田　量壱', headTeacher: '齋藤' },
  { code: '98', name: '神栖二', municipality: '神栖市', phone: '0299-92-0652', principal: '長峰　正道', headTeacher: '木村' },
  { code: '99', name: '神栖三', municipality: '神栖市', phone: '0299-96-1414', principal: '冨田　功', headTeacher: '佐保・小橋' },
  { code: '100', name: '神栖四', municipality: '神栖市', phone: '0299-92-8751', principal: '多辺田　弘之', headTeacher: '林田・板橋' },
  { code: '101', name: '波崎一', municipality: '神栖市', phone: '0479-44-0271', principal: '渡辺　知佳子', headTeacher: '藪田・徳元' },
  { code: '102', name: '波崎二', municipality: '神栖市', phone: '0479-48-0014', principal: '加藤　哲也', headTeacher: '編集中！' },
  { code: '103', name: '波崎三', municipality: '神栖市', phone: '0479-46-0042', principal: '菊巒　隆博', headTeacher: '森山・横田' },
  { code: '104', name: '波崎四', municipality: '神栖市', phone: '0479-48-5123', principal: '高倉　紀行', headTeacher: '石村・坂戸' },
  { code: '105', name: '麻生', municipality: '行方市', phone: '0299-80-8070', principal: '大﨑　雅之', headTeacher: '山口・眞田' },
  { code: '106', name: '北浦', municipality: '行方市', phone: '0291-35-2161', principal: '野口　孝幸', headTeacher: '小林・阿部' },
  { code: '107', name: '玉造', municipality: '行方市', phone: '0299-55-0131', principal: '遠藤　智平', headTeacher: '栗原・店曲' },
  { code: '108', name: '旭', municipality: '鉾田市', phone: '0291-37-0030', principal: '増形　岳', headTeacher: '磯崎・安藤' },
  { code: '109', name: '鉾田北', municipality: '鉾田市', phone: '0291-36-2814', principal: '本城　知子', headTeacher: '田山・小島' },
  { code: '110', name: '鉾田南', municipality: '鉾田市', phone: '0291-32-2757', principal: '宮内　孝浩', headTeacher: '西尾・戸島' },
  { code: '111', name: '大洋', municipality: '鉾田市', phone: '0291-39-3231', principal: '高柳　繁', headTeacher: '若松・宮嶋' },
  { code: '112', name: '土浦一', municipality: '土浦市', phone: '029-821-3679', principal: '編集中！', headTeacher: '編集中！' },
  { code: '113', name: '土浦二', municipality: '土浦市', phone: '029-821-0808', principal: '岩田　幸一', headTeacher: '遠藤・足立' },
  { code: '114', name: '土浦三', municipality: '土浦市', phone: '029-841-0200', principal: '東　治樹', headTeacher: '阪野・張替' },
  { code: '115', name: '土浦四', municipality: '土浦市', phone: '029-821-0297', principal: '永井　厚', headTeacher: '酒井' },
  { code: '116', name: '土浦五', municipality: '土浦市', phone: '029-828-1021', principal: '編集中！', headTeacher: '編集中！' },
  { code: '117', name: '土浦六', municipality: '土浦市', phone: '029-842-7751', principal: '廣瀬　光幸', headTeacher: '栗原・伊東' },
  { code: '118', name: '都和', municipality: '土浦市', phone: '029-831-0866', principal: '編集中！', headTeacher: '編集中！' },
  { code: '119', name: '新治', municipality: '土浦市', phone: '029-862-3503', principal: '編集中！', headTeacher: '編集中！' },
  { code: '120', name: '石岡', municipality: '石岡市', phone: '0299-26-2340', principal: '朝賀　隆行', headTeacher: '脇田・藤枝' },
  { code: '121', name: '府中', municipality: '石岡市', phone: '0299-24-0022', principal: '立見　一郎', headTeacher: '芝山・天野' },
  { code: '122', name: '国府', municipality: '石岡市', phone: '0299-24-0510', principal: '井元　光子', headTeacher: '大野' },
  { code: '123', name: '園部', municipality: '石岡市', phone: '0299-46-0506', principal: '大山　義夫', headTeacher: '佐藤・菊次' },
  { code: '124', name: '八郷', municipality: '石岡市', phone: '0299-43-0062', principal: '中里　憲一', headTeacher: '長島・佐川' },
  { code: '125', name: '龍ヶ崎', municipality: '龍ケ崎市', phone: '0297-62-1209', principal: '五十嵐　淳', headTeacher: '酒巻・千葉' },
  { code: '127', name: '長山', municipality: '龍ケ崎市', phone: '0297-66-1766', principal: '編集中！', headTeacher: '編集中！' },
  { code: '128', name: '城西', municipality: '龍ケ崎市', phone: '0297-66-4157', principal: '編集中！', headTeacher: '編集中！' },
  { code: '129', name: '中根台', municipality: '龍ケ崎市', phone: '0297-65-2270', principal: '編集中！', headTeacher: '編集中！' },
  { code: '130', name: '城ノ内', municipality: '龍ケ崎市', phone: '0297-62-2372', principal: '根本　昭和', headTeacher: '松崎・増尾' },
  { code: '131', name: '取手一', municipality: '取手市', phone: '0297-74-2215', principal: '髙橋　正史', headTeacher: '中島・黒島' },
  { code: '132', name: '取手二', municipality: '取手市', phone: '0297-72-0102', principal: '編集中！', headTeacher: '編集中！' },
  { code: '133', name: '永山', municipality: '取手市', phone: '0297-78-8004', principal: '編集中！', headTeacher: '編集中！' },
  { code: '134', name: '戸頭', municipality: '取手市', phone: '0297-78-0380', principal: '編集中！', headTeacher: '編集中！' },
  { code: '135', name: '藤代', municipality: '取手市', phone: '0297-83-0260', principal: '岡崎　学', headTeacher: '福田・落合' },
  { code: '136', name: '藤代南', municipality: '取手市', phone: '0297-83-3215', principal: '堀田　将寿', headTeacher: '上岡・成島' },
  { code: '137', name: '牛久一', municipality: '牛久市', phone: '029-872-0310', principal: '唯根　正一', headTeacher: '垣内・福田' },
  { code: '138', name: 'おくの', municipality: '牛久市', phone: '029-875-0055', principal: '吉田　正人', headTeacher: '外山' },
  { code: '139', name: '牛久三', municipality: '牛久市', phone: '029-873-4699', principal: '木田　正広', headTeacher: '生田目・亀山' },
  { code: '140', name: '下根', municipality: '牛久市', phone: '029-873-6153', principal: '編集中！', headTeacher: '編集中！' },
  { code: '141', name: '牛久南', municipality: '牛久市', phone: '029-873-5886', principal: '編集中！', headTeacher: '編集中！' },
  { code: '142', name: '桜', municipality: 'つくば市', phone: '029-857-2038', principal: '小林　力', headTeacher: '濱口・井上' },
  { code: '143', name: '竹園東', municipality: 'つくば市', phone: '029-851-3467', principal: '編集中！', headTeacher: '編集中！' },
  { code: '144', name: '並木', municipality: 'つくば市', phone: '029-851-7100', principal: '渡邊　聡', headTeacher: '杉山・塚原' },
  { code: '145', name: '吾妻', municipality: 'つくば市', phone: '029-852-7751', principal: '編集中！', headTeacher: '編集中！' },
  { code: '146', name: '谷田部', municipality: 'つくば市', phone: '029-836-0008', principal: '編集中！', headTeacher: '編集中！' },
  { code: '147', name: '高山', municipality: 'つくば市', phone: '029-847-7325', principal: '編集中！', headTeacher: '編集中！' },
  { code: '148', name: '手代木', municipality: 'つくば市', phone: '029-852-0721', principal: '四位　悟', headTeacher: '大曽根・平嶋' },
  { code: '149', name: '谷田部東', municipality: 'つくば市', phone: '029-855-7745', principal: '井橋　憲一', headTeacher: '立川・小田' },
  { code: '150', name: '豊里', municipality: 'つくば市', phone: '029-847-2307', principal: '岡野　浩則', headTeacher: '大塚・菊田' },
  { code: '151', name: '秀峰', municipality: 'つくば市', phone: '029-846-2611', principal: '編集中！', headTeacher: '編集中！' },
  { code: '152', name: '大穂', municipality: 'つくば市', phone: '029-864-0167', principal: '編集中！', headTeacher: '編集中！' },
  { code: '153', name: '茎崎', municipality: 'つくば市', phone: '029-876-0055', principal: '高野　満美子', headTeacher: '海老原・石上' },
  { code: '154', name: '高崎', municipality: 'つくば市', phone: '029-872-4473', principal: '編集中！', headTeacher: '編集中！' },
  { code: '155', name: '春日', municipality: 'つくば市', phone: '0298-56-3110', principal: '編集中！', headTeacher: '編集中！' },
  { code: '156', name: '学園の森', municipality: 'つくば市', phone: '029-846-3115', principal: '編集中！', headTeacher: '編集中！' },
  { code: '157', name: 'みどりの', municipality: 'つくば市', phone: '029-846-2422', principal: '山田　聡', headTeacher: '水井・朝生' },
  { code: '158', name: '守谷', municipality: '守谷市', phone: '0297-48-0034', principal: '池田　恭', headTeacher: '武藤' },
  { code: '159', name: '守谷愛宕', municipality: '守谷市', phone: '0297-48-6601', principal: '編集中！', headTeacher: '編集中！' },
  { code: '160', name: '御所ヶ丘', municipality: '守谷市', phone: '0297-48-7891', principal: '編集中！', headTeacher: '編集中！' },
  { code: '161', name: 'けやき台', municipality: '守谷市', phone: '0297-45-7431', principal: '下村　典子', headTeacher: '後藤・福田' },
  { code: '162', name: '江戸崎', municipality: '稲敷市', phone: '029-892-2800', principal: '若林　克治', headTeacher: '浅香・浅野' },
  { code: '163', name: '新利根', municipality: '稲敷市', phone: '0297-87-2071', principal: '池田　尚人', headTeacher: '三浦・日向寺' },
  { code: '164', name: '桜川', municipality: '稲敷市', phone: '029-894-2172', principal: '小松原　剛', headTeacher: '小西・仁平' },
  { code: '165', name: '東', municipality: '稲敷市', phone: '0299-79-2206', principal: '編集中！', headTeacher: '編集中！' },
  { code: '166', name: '霞ケ浦', municipality: 'かすみがうら市', phone: '0298-97-1211', principal: '奥沢　哲也', headTeacher: '端・松浦' },
  { code: '167', name: '千代田', municipality: 'かすみがうら市', phone: '0299-59-3502', principal: '編集中！', headTeacher: '編集中！' },
  { code: '168', name: '下稲吉', municipality: 'かすみがうら市', phone: '029-831-7400', principal: '嶋田　稔', headTeacher: '稲生ゆ・稲生あ' },
  { code: '169', name: '伊奈', municipality: 'つくばみらい市', phone: '0297-58-0201', principal: '編集中！', headTeacher: '編集中！' },
  { code: '170', name: '伊奈東', municipality: 'つくばみらい市', phone: '0297-58-4631', principal: '中村　進一', headTeacher: '伊藤・大山' },
  { code: '171', name: '谷和原', municipality: 'つくばみらい市', phone: '0297-52-2038', principal: '編集中！', headTeacher: '編集中！' },
  { code: '172', name: '小絹', municipality: 'つくばみらい市', phone: '0297-52-0505', principal: '編集中！', headTeacher: '編集中！' },
  { code: '173', name: '美浦', municipality: '稲敷郡美浦村', phone: '029-885-0121', principal: '編集中！', headTeacher: '編集中！' },
  { code: '174', name: '阿見', municipality: '稲敷郡阿見町', phone: '029-887-0028', principal: '渡邉　健司', headTeacher: '佐野・植竹' },
  { code: '175', name: '朝日', municipality: '稲敷郡阿見町', phone: '029-842-7771', principal: '編集中！', headTeacher: '編集中！' },
  { code: '176', name: '竹来', municipality: '稲敷郡阿見町', phone: '029-887-1201', principal: '岡野　友宏', headTeacher: '尾島・藤枝' },
  { code: '177', name: 'かわち', municipality: '稲敷郡河内町', phone: '0297-84-2355', principal: '編集中！', headTeacher: '編集中！' },
  { code: '178', name: '利根', municipality: '北相馬郡利根町', phone: '0297-68-2870', principal: '直井　由貴', headTeacher: '座間・中島' },
  { code: '179', name: '古河一', municipality: '古河市', phone: '0280-32-0183', principal: '横濱　元己', headTeacher: '鈴木・富田' },
  { code: '180', name: '古河二', municipality: '古河市', phone: '0280-48-1464', principal: '菊池　隆史', headTeacher: '岡野・松下' },
  { code: '181', name: '古河三', municipality: '古河市', phone: '0280-32-6711', principal: '川村　健', headTeacher: '尾崎・坂野' },
  { code: '182', name: '総和', municipality: '古河市', phone: '0280-92-0057', principal: '青木　誠一', headTeacher: '忍田・中村' },
  { code: '183', name: '総和北', municipality: '古河市', phone: '0280-98-0330', principal: '編集中！', headTeacher: '編集中！' },
  { code: '184', name: '総和南', municipality: '古河市', phone: '0280-92-1709', principal: '桑原　敬明', headTeacher: '川村・黒川' },
  { code: '185', name: '三和', municipality: '古河市', phone: '0280-76-0133', principal: '前田　隆浩', headTeacher: '岡田・長濵' },
  { code: '186', name: '三和北', municipality: '古河市', phone: '0280-76-5900', principal: '西　俊隆', headTeacher: '落合・坂本' },
  { code: '187', name: '三和東', municipality: '古河市', phone: '0280-76-7676', principal: '荒井　幸枝', headTeacher: '席・篠塚' },
  { code: '188', name: '結城', municipality: '結城市', phone: '0296-33-2154', principal: '木村　成雄', headTeacher: '白石・野口' },
  { code: '189', name: '結城南', municipality: '結城市', phone: '0296-35-0345', principal: '塚田　裕史', headTeacher: '為我井・笠井' },
  { code: '190', name: '結城東', municipality: '結城市', phone: '0296-33-5101', principal: '渡邉　孝典', headTeacher: '川﨑・木村' },
  { code: '191', name: '下妻', municipality: '下妻市', phone: '0296-43-3961', principal: '圓﨑　佳江', headTeacher: '加藤・瀬端' },
  { code: '192', name: '東部', municipality: '下妻市', phone: '0296-44-2731', principal: '福田　恭子', headTeacher: '澤邊・中島' },
  { code: '193', name: '千代川', municipality: '下妻市', phone: '0296-44-2049', principal: '編集中！', headTeacher: '編集中！' },
  { code: '194', name: '水海道', municipality: '常総市', phone: '0297-22-0860', principal: '編集中！', headTeacher: '編集中！' },
  { code: '195', name: '水海道西', municipality: '常総市', phone: '0297-24-0548', principal: '倉持　訓', headTeacher: '浅野・久保田' },
  { code: '196', name: '鬼怒', municipality: '常総市', phone: '0297-22-7621', principal: '編集中！', headTeacher: '編集中！' },
  { code: '197', name: '石下', municipality: '常総市', phone: '0297-42-2241', principal: '柴崎　一成', headTeacher: '助川・木下' },
  { code: '198', name: '石下西', municipality: '常総市', phone: '0297-42-4788', principal: '入江　宏', headTeacher: '渡辺・古家野' },
  { code: '199', name: '下館', municipality: '筑西市', phone: '0296-24-0314', principal: '田崎　諭', headTeacher: '千葉・飯田' },
  { code: '200', name: '下館西', municipality: '筑西市', phone: '0296-28-0404', principal: '宮山　理', headTeacher: '渡辺・枝川' },
  { code: '201', name: '下館南', municipality: '筑西市', phone: '0296-22-3736', principal: '谷島　敏浩', headTeacher: '西宮・坂入' },
  { code: '202', name: '下館北', municipality: '筑西市', phone: '0296-22-2334', principal: '編集中！', headTeacher: '編集中！' },
  { code: '203', name: '関城', municipality: '筑西市', phone: '0296-37-6055', principal: '根本　愛子', headTeacher: '赤塚・中山' },
  { code: '204', name: '明野', municipality: '筑西市', phone: '0296-52-0202', principal: '入山　克巳', headTeacher: '𠮷原・小澤' },
  { code: '205', name: '協和', municipality: '筑西市', phone: '0296-57-3155', principal: '武井　勉', headTeacher: '神田・根本' },
  { code: '206', name: '坂東東', municipality: '坂東市', phone: '0297-39-2313', principal: '逆井　隆史', headTeacher: '脇坂' },
  { code: '207', name: '岩井', municipality: '坂東市', phone: '0297-34-3141', principal: '鈴木　清子', headTeacher: '増田・和田' },
  { code: '208', name: '坂東南', municipality: '坂東市', phone: '0297-38-2602', principal: '倉持　浩', headTeacher: '岩田・水野' },
  { code: '209', name: '猿島', municipality: '坂東市', phone: '0280-88-0907', principal: '編集中！', headTeacher: '岩崎・山口' },
  { code: '210', name: '岩瀬東', municipality: '桜川市', phone: '0296-75-5119', principal: '村田　則文', headTeacher: '谷中・久保田' },
  { code: '211', name: '岩瀬西', municipality: '桜川市', phone: '0296-75-2104', principal: '塚本　順子', headTeacher: '樋口・藤井' },
  { code: '212', name: '大和', municipality: '桜川市', phone: '0296-58-5042', principal: '斉藤　陽枝', headTeacher: '小島' },
  { code: '213', name: '真壁桜川', municipality: '桜川市', phone: '0296-55-0157', principal: '斎藤　守一', headTeacher: '久保・叶谷' },
  { code: '215', name: '八千代一', municipality: '結城郡八千代町', phone: '0296-48-0178', principal: '沢木　滋', headTeacher: '沼田・太田' },
  { code: '216', name: '八千代東', municipality: '結城郡八千代町', phone: '0296-48-0787', principal: '太田　一茂', headTeacher: '橋本' },
  { code: '217', name: '五霞', municipality: '猿島郡五霞町', phone: '0280-84-0079', principal: '南城　ひろみ', headTeacher: '須田・小倉' },
  { code: '218', name: '境一', municipality: '猿島郡境町', phone: '0280-87-0016', principal: '内海　孝至', headTeacher: '岩田・椎名' },
  { code: '219', name: '境二', municipality: '猿島郡境町', phone: '0280-86-5316', principal: '編集中！', headTeacher: '編集中！' },
  { code: '220', name: '茨大附属', municipality: '国立私立', phone: '029-221-3379', principal: '春原　孝政', headTeacher: '小倉・上曽' },
  { code: '221', name: 'ひたち野うしく', municipality: '牛久市', phone: '029-875-8595', principal: '編集中！', headTeacher: '編集中！' },
  { code: '300', name: '英宏', municipality: '国立私立', phone: '029-243-0840', principal: '田中久美子', headTeacher: '中村・井上' },
  { code: '301', name: 'あその', municipality: '県外', phone: '0475-77-2840', principal: '編集中！', headTeacher: '編集中！' },
  { code: '302', name: '間々田', municipality: '県外', phone: '0285-45-0062', principal: '編集中！', headTeacher: '編集中！' },
  { code: '303', name: '山前', municipality: '県外', phone: '0285-82-2540', principal: '編集中！', headTeacher: '編集中！' },
  { code: '304', name: '大泉北', municipality: '県外', phone: '0276-62-2059', principal: '編集中！', headTeacher: '編集中！' },
  { code: '305', name: '赤塚第一', municipality: '県外', phone: '03-3932-5314', principal: '編集中！', headTeacher: '編集中！' },
];

// Helper to generate realistic dummy data
const generateDummyStudents = (): any[] => {
  const dummyData = [];
  const familyNames = ['佐藤', '鈴木', '高橋', '田中', '伊藤', '渡辺', '山本', '中村', '小林', '加藤', '吉田', '山田', '佐々木', '山口', '松本', '井上', '木村', '林', '斎藤', '清水'];
  const givenNamesMale = ['大翔', '陽翔', '蓮', '湊', '蒼', '悠真', '樹', '大和', '陽太', '陸'];
  const givenNamesFemale = ['陽葵', '凛', '結菜', '芽依', '詩', '結愛', '莉子', '紬', '澪', '咲良'];
  
  const schools = INITIAL_SCHOOL_DATABASE;
  
  for (let i = 0; i < 50; i++) {
    const gender = i % 3 === 0 ? Gender.FEMALE : Gender.MALE;
    const familyName = familyNames[i % familyNames.length];
    const givenName = gender === Gender.MALE ? givenNamesMale[i % givenNamesMale.length] : givenNamesFemale[i % givenNamesFemale.length];
    const school = schools[i % schools.length];
    
    // Randomize status
    const rand = Math.random();
    let result = RecruitmentResult.PENDING;
    let prospect = ProspectLevel.UNKNOWN;
    let callDateP = '';
    let callDateA = '';
    let visitDate = '';
    
    if (rand > 0.8) {
        result = RecruitmentResult.ACCEPTED;
        prospect = ProspectLevel.HIGH;
        callDateP = '2025-06-10';
        callDateA = '2025-06-15';
        visitDate = '2025-07-01';
    } else if (rand > 0.6) {
        prospect = ProspectLevel.HIGH;
        callDateP = '2025-06-12';
        visitDate = '2025-07-15';
    } else if (rand > 0.4) {
        prospect = ProspectLevel.LOW;
        callDateA = '2025-06-20';
    } else if (rand > 0.2) {
        visitDate = '×';
        result = RecruitmentResult.DECLINED;
    }

    dummyData.push({
      id: (i + 1000).toString(),
      no: i + 1,
      municipality: school.municipality,
      schoolName: school.name,
      schoolCode: school.code,
      principalName: school.principal || '',
      teacherInCharge: school.headTeacher || '',
      schoolPhone: school.phone || '',
      clubName: CLUBS[i % CLUBS.length],
      studentName: `${familyName} ${givenName}`,
      studentFurigana: 'かな', // Simplified for dummy
      gender: gender,
      clubAchievements: i % 4 === 0 ? '県大会出場' : (i % 5 === 0 ? '選抜選手' : 'レギュラー'),
      academicScore: `${250 + (i * 5)}点`,
      scholarshipRank: i % 10 === 0 ? ScholarshipRank.S1 : (i % 5 === 0 ? ScholarshipRank.S2 : ScholarshipRank.NONE),
      recruiterType: RECRUITERS[i % RECRUITERS.length],
      callDatePrincipal: callDateP,
      callDateAdvisor: callDateA,
      visitDate: visitDate,
      prospect: prospect,
      result: result,
      notes: i % 7 === 0 ? '保護者も前向き' : ''
    });
  }
  return dummyData;
};

export const INITIAL_STUDENTS: any[] = generateDummyStudents();
