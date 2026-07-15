# 种子数据重构 V2

## 目标
每种数据类型 30+ 条，数据来自真实行业知识，使用 picsum.photos 占位图。

## 数据结构
参考现有 seed.ts 中的实体结构，保持数据库表不变。

## 图片策略
使用 `https://picsum.photos/seed/{keyword}/{width}/{height}` 获取真实感占位图。
