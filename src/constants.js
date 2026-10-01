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
// 注：「兑」（积分兑换票）沿用既有行为，不显示徽章，故不在此表中
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
}

// 合法优惠类型（空字符串表示「无优惠」）
export const VALID_DISCOUNT_TYPES = ['兑', ...Object.keys(DISCOUNT_TEXT_MAP), '']
