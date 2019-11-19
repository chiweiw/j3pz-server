import {
    PrimaryAttribute, School, DecoratorTuple, ExtraAttribute, SecondaryAttribute, GamingRole,
} from '../model/Base';

type AttributeBaseValue = Partial<Record<PrimaryAttribute | SecondaryAttribute | ExtraAttribute, number>>;
type AttributeFactor = Partial<Record<SecondaryAttribute | ExtraAttribute, number>>;

export interface KungFuMeta {
    // 主属性
    primaryAttribute: PrimaryAttribute;
    // 门派
    school: School;
    // 心法类型
    role: GamingRole;
    // 属性修饰
    decorator: DecoratorTuple[];
    // 属性基础数值
    base: AttributeBaseValue;
    // 主属性提升比例
    factor: AttributeFactor;
    // 覆盖默认提升比例
    override: AttributeFactor;
}
