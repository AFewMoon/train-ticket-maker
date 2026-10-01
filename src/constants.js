/**
 * @file constants.js - 跨组件共享的常量与映射表
 *
 * 注意：这些常量必须放在模块作用域（而非 <script setup> 内部）才能被
 * defineProps 的 validator 引用。Vue SFC 编译器会把 defineProps 提升到模块
 * 作用域，因此 validator 无法访问在它之后于 <script setup> 中声明的局部常量，
 * 详见 AGENTS.md「经验教训 #1」。
 */

// 卧铺类座位：选中时才显示「铺位类型」并允许填写铺位
export const SLEEPER_TYPES = [
  '软卧',
  '硬卧',
  '动卧',
  '高级软卧',
  '一等卧',
  '二等卧',
  '新空调硬卧',
  '新空调软卧',
]

// 优惠类型 -> 票面徽章文字（一个类型可能对应多个徽章，如学生票为「学 + 惠」）
// 本表是徽章文案的唯一数据源，VALID_DISCOUNT_TYPES 由其派生，新增优惠类型只需改这一处
export const DISCOUNT_TEXT_MAP = {
  student: ['学', '惠'],
  discount: ['惠'],
  child: ['儿'],
  elder: ['老'],
  military: ['军'],
  disabled: ['残'],
  group: ['团'],
  'worker-group': ['工'],
  'student-group': ['学', '团'],
  '兑': ['兑'],
}

// 合法优惠类型（空字符串表示「无优惠」）
export const VALID_DISCOUNT_TYPES = [...Object.keys(DISCOUNT_TEXT_MAP), '']

// 优惠类型下拉框选项：数组顺序即下拉框展示顺序（「无优惠」置顶）。
// value 必须与 DISCOUNT_TEXT_MAP 的键保持一致；括号内的徽章提示由 DISCOUNT_TEXT_MAP 派生，
// 因此徽章文案仍只有一处来源，新增优惠类型时只需在 DISCOUNT_TEXT_MAP 与下方列表各加一项。
export const DISCOUNT_OPTIONS = [
  { value: '', label: '无优惠' },
  { value: 'student', label: '学生票' },
  { value: 'child', label: '儿童票' },
  { value: 'military', label: '残疾军人票' },
  { value: 'disabled', label: '残疾人票' },
  { value: 'elder', label: '老人优惠票' },
  { value: 'discount', label: '普通优惠票' },
  { value: 'group', label: '团体票' },
  { value: 'worker-group', label: '务工团体票' },
  { value: 'student-group', label: '学生团体票' },
  { value: '兑', label: '积分兑换票' },
].map(({ value, label }) => {
  const badges = DISCOUNT_TEXT_MAP[value]
  return { value, label, text: badges ? `${label}（${badges.join(' + ')}）` : label }
})
