import { useState, useEffect, useCallback } from 'react';
import { FiPlus, FiTrash2, FiX, FiRefreshCw, FiEdit2 } from 'react-icons/fi';

// Predefined attributes for Apple products
const PREDEFINED_ATTRIBUTES = [
    { name: 'type', label: 'Loại', options: ['nguyen-seal', 'openbox', 'cpo'], displayLabels: ['Nguyên Seal', 'Openbox', 'CPO'] },
    { name: 'model', label: 'Model', options: ['wifi', 'wifi-cellular'], displayLabels: ['WiFi', 'WiFi + Cellular'] },
    { name: 'color', label: 'Màu sắc', options: [] },
    { name: 'storage', label: 'Dung lượng', options: ['64GB', '128GB', '256GB', '512GB', '1TB', '2TB'] },
    { name: 'memory', label: 'RAM', options: ['8GB', '16GB', '18GB', '24GB', '32GB', '36GB', '48GB', '64GB'] },
    { name: 'chip', label: 'Chip', options: ['M1', 'M2', 'M3', 'M4', 'M1 Pro', 'M1 Max', 'M2 Pro', 'M2 Max', 'M3 Pro', 'M3 Max', 'M4 Pro', 'M4 Max'] },
    { name: 'size', label: 'Kích thước', options: ['11 inch', '12.9 inch', '13 inch', '14 inch', '15 inch', '16 inch'] },
];

// Generate SKU from options
const generateSku = (baseSku, options) => {
    const parts = [baseSku];
    Object.values(options).forEach(val => {
        if (val) parts.push(val.replace(/\s+/g, '').toUpperCase().slice(0, 6));
    });
    return parts.join('-');
};

// Generate variant name from options
const generateVariantName = (options) => {
    const typeLabels = { 'nguyen-seal': 'Nguyên Seal', 'openbox': 'Openbox', 'cpo': 'CPO' };
    const modelLabels = { 'wifi': 'WiFi', 'wifi-cellular': 'WiFi + Cellular' };

    const parts = [];
    if (options.type) parts.push(typeLabels[options.type] || options.type);
    if (options.model) parts.push(modelLabels[options.model] || options.model);
    if (options.storage) parts.push(options.storage);
    if (options.memory) parts.push(options.memory);
    if (options.color) parts.push(options.color);
    if (options.size) parts.push(options.size);
    if (options.chip) parts.push(options.chip);

    return parts.join(' - ') || 'Variant';
};

/**
 * VariantManager Component
 * Quản lý biến thể sản phẩm với Generator và Table
 */
const VariantManager = ({
    variants = [],
    onChange,
    basePrice = 0,
    baseSku = 'SKU'
}) => {
    const [isEnabled, setIsEnabled] = useState(variants.length > 0);
    const [selectedAttributes, setSelectedAttributes] = useState([]);
    const [attributeValues, setAttributeValues] = useState({});
    const [editingIndex, setEditingIndex] = useState(null);

    // Sync isEnabled with variants
    useEffect(() => {
        if (variants.length > 0 && !isEnabled) {
            setIsEnabled(true);
        }
    }, [variants, isEnabled]);

    // Handle toggle variants
    const handleToggle = () => {
        setIsEnabled(!isEnabled);
        if (isEnabled) {
            // Clearing variants
            onChange([]);
            setSelectedAttributes([]);
            setAttributeValues({});
        }
    };

    // Add attribute to selected list
    const addAttribute = (attrName) => {
        if (!selectedAttributes.includes(attrName)) {
            setSelectedAttributes([...selectedAttributes, attrName]);
            setAttributeValues(prev => ({ ...prev, [attrName]: [] }));
        }
    };

    // Remove attribute
    const removeAttribute = (attrName) => {
        setSelectedAttributes(selectedAttributes.filter(a => a !== attrName));
        setAttributeValues(prev => {
            const newValues = { ...prev };
            delete newValues[attrName];
            return newValues;
        });
    };

    // Update attribute values
    const updateAttributeValues = (attrName, values) => {
        setAttributeValues(prev => ({ ...prev, [attrName]: values }));
    };

    // Add custom value to attribute
    const handleAddCustomValue = (attrName, value) => {
        if (value && !attributeValues[attrName]?.includes(value)) {
            updateAttributeValues(attrName, [...(attributeValues[attrName] || []), value]);
        }
    };

    // Toggle value selection
    const toggleValue = (attrName, value) => {
        const currentValues = attributeValues[attrName] || [];
        if (currentValues.includes(value)) {
            updateAttributeValues(attrName, currentValues.filter(v => v !== value));
        } else {
            updateAttributeValues(attrName, [...currentValues, value]);
        }
    };

    // Generate all combinations
    const generateCombinations = useCallback((attributes, values) => {
        if (attributes.length === 0) return [{}];

        const [first, ...rest] = attributes;
        const firstValues = values[first] || [];

        if (firstValues.length === 0) {
            return generateCombinations(rest, values);
        }

        const restCombinations = generateCombinations(rest, values);
        const combinations = [];

        firstValues.forEach(value => {
            restCombinations.forEach(combo => {
                combinations.push({ [first]: value, ...combo });
            });
        });

        return combinations;
    }, []);

    // Generate variants from selected attributes
    const handleGenerateVariants = () => {
        const combinations = generateCombinations(selectedAttributes, attributeValues);

        if (combinations.length === 0 || (combinations.length === 1 && Object.keys(combinations[0]).length === 0)) {
            alert('Vui lòng chọn ít nhất một giá trị cho thuộc tính');
            return;
        }

        const newVariants = combinations.map((combo, index) => {
            // Check if variant already exists
            const existingVariant = variants.find(v => {
                return selectedAttributes.every(attr =>
                    v.attributes?.[attr] === combo[attr] || v[attr] === combo[attr]
                );
            });

            if (existingVariant) {
                return existingVariant;
            }

            const attributes = {};
            let type = 'nguyen-seal';
            let model = 'wifi';

            selectedAttributes.forEach(attr => {
                if (attr === 'type') {
                    type = combo[attr];
                } else if (attr === 'model') {
                    model = combo[attr];
                } else {
                    attributes[attr] = combo[attr];
                }
            });

            return {
                sku: generateSku(baseSku, combo),
                name: generateVariantName(combo),
                type,
                model,
                attributes,
                price: basePrice || 0,
                originalPrice: 0,
                costPrice: 0,
                stock: 0,
                reserved: 0,
                lowStockThreshold: 5,
                image: '',
                images: [],
                isActive: true,
                isFeatured: index === 0,
            };
        });

        onChange(newVariants);
    };

    // Update single variant
    const updateVariant = (index, field, value) => {
        const newVariants = [...variants];
        newVariants[index] = { ...newVariants[index], [field]: value };
        onChange(newVariants);
    };

    // Delete variant
    const deleteVariant = (index) => {
        const newVariants = variants.filter((_, i) => i !== index);
        onChange(newVariants);
    };

    // Add single variant manually
    const addSingleVariant = () => {
        const newVariant = {
            sku: `${baseSku}-${Date.now()}`,
            name: 'Biến thể mới',
            type: 'nguyen-seal',
            model: 'wifi',
            attributes: {},
            price: basePrice || 0,
            originalPrice: 0,
            costPrice: 0,
            stock: 0,
            reserved: 0,
            lowStockThreshold: 5,
            image: '',
            images: [],
            isActive: true,
            isFeatured: variants.length === 0,
        };
        onChange([...variants, newVariant]);
        setEditingIndex(variants.length);
    };

    // Get available attributes (not yet selected)
    const availableAttributes = PREDEFINED_ATTRIBUTES.filter(
        attr => !selectedAttributes.includes(attr.name)
    );

    if (!isEnabled) {
        return (
            <div className="border rounded-lg p-4 bg-gray-50">
                <label className="flex items-center gap-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={isEnabled}
                        onChange={handleToggle}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="font-medium text-gray-700">
                        Sản phẩm có nhiều biến thể (SKU, màu sắc, dung lượng...)
                    </span>
                </label>
            </div>
        );
    }

    return (
        <div className="border rounded-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gray-50 p-4 flex items-center justify-between">
                <label className="flex items-center gap-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={isEnabled}
                        onChange={handleToggle}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="font-medium text-gray-700">Quản lý biến thể</span>
                </label>
                <button
                    type="button"
                    onClick={addSingleVariant}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white border rounded-lg hover:bg-gray-50"
                >
                    <FiPlus size={14} />
                    Thêm biến thể
                </button>
            </div>

            <div className="p-4 space-y-4">
                {/* Attribute Selector */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-gray-600">Chọn thuộc tính:</span>
                        {availableAttributes.map(attr => (
                            <button
                                key={attr.name}
                                type="button"
                                onClick={() => addAttribute(attr.name)}
                                className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100"
                            >
                                + {attr.label}
                            </button>
                        ))}
                    </div>

                    {/* Selected Attributes */}
                    {selectedAttributes.map(attrName => {
                        const attr = PREDEFINED_ATTRIBUTES.find(a => a.name === attrName);
                        if (!attr) return null;

                        return (
                            <div key={attrName} className="border rounded-lg p-3 bg-white">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-gray-700">{attr.label}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeAttribute(attrName)}
                                        className="text-red-500 hover:text-red-600"
                                    >
                                        <FiX size={16} />
                                    </button>
                                </div>

                                {/* Predefined options */}
                                {attr.options.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {attr.options.map((option, idx) => (
                                            <button
                                                key={option}
                                                type="button"
                                                onClick={() => toggleValue(attrName, option)}
                                                className={`px-3 py-1 text-sm rounded-full border transition-colors ${attributeValues[attrName]?.includes(option)
                                                        ? 'bg-blue-600 text-white border-blue-600'
                                                        : 'bg-white text-gray-600 hover:border-blue-300'
                                                    }`}
                                            >
                                                {attr.displayLabels?.[idx] || option}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Custom value input */}
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder={`Thêm ${attr.label.toLowerCase()} khác...`}
                                        className="flex-1 px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleAddCustomValue(attrName, e.target.value);
                                                e.target.value = '';
                                            }
                                        }}
                                    />
                                </div>

                                {/* Selected values */}
                                {attributeValues[attrName]?.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {attributeValues[attrName]
                                            .filter(v => !attr.options.includes(v))
                                            .map(value => (
                                                <span
                                                    key={value}
                                                    className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full flex items-center gap-1"
                                                >
                                                    {value}
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleValue(attrName, value)}
                                                        className="hover:text-green-900"
                                                    >
                                                        <FiX size={12} />
                                                    </button>
                                                </span>
                                            ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {/* Generate Button */}
                    {selectedAttributes.length > 0 && (
                        <button
                            type="button"
                            onClick={handleGenerateVariants}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                            <FiRefreshCw size={16} />
                            Tạo biến thể ({
                                selectedAttributes.reduce((count, attr) => {
                                    const values = attributeValues[attr] || [];
                                    return count === 0 ? values.length : count * (values.length || 1);
                                }, 0)
                            } combinations)
                        </button>
                    )}
                </div>

                {/* Variants Table */}
                {variants.length > 0 && (
                    <div className="border rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50 text-left">
                                        <th className="p-3 font-medium text-gray-600">Tên / SKU</th>
                                        <th className="p-3 font-medium text-gray-600 w-32">Giá bán</th>
                                        <th className="p-3 font-medium text-gray-600 w-24">Tồn kho</th>
                                        <th className="p-3 font-medium text-gray-600 w-20">Active</th>
                                        <th className="p-3 font-medium text-gray-600 w-20"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {variants.map((variant, index) => (
                                        <tr key={variant.sku || index} className="border-t">
                                            <td className="p-2">
                                                {editingIndex === index ? (
                                                    <div className="space-y-1">
                                                        <input
                                                            type="text"
                                                            value={variant.name || ''}
                                                            onChange={(e) => updateVariant(index, 'name', e.target.value)}
                                                            className="w-full px-2 py-1 border rounded text-sm"
                                                            placeholder="Tên biến thể"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={variant.sku || ''}
                                                            onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                                                            className="w-full px-2 py-1 border rounded text-xs text-gray-500"
                                                            placeholder="SKU"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <p className="font-medium text-gray-800">{variant.name || 'Unnamed'}</p>
                                                        <p className="text-xs text-gray-500">{variant.sku}</p>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-2">
                                                <input
                                                    type="number"
                                                    value={variant.price || ''}
                                                    onChange={(e) => updateVariant(index, 'price', Number(e.target.value))}
                                                    className="w-full px-2 py-1 border rounded text-sm"
                                                    placeholder="0"
                                                    min="0"
                                                />
                                            </td>
                                            <td className="p-2">
                                                <input
                                                    type="number"
                                                    value={variant.stock || ''}
                                                    onChange={(e) => updateVariant(index, 'stock', Number(e.target.value))}
                                                    className="w-full px-2 py-1 border rounded text-sm"
                                                    placeholder="0"
                                                    min="0"
                                                />
                                            </td>
                                            <td className="p-2 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={variant.isActive !== false}
                                                    onChange={(e) => updateVariant(index, 'isActive', e.target.checked)}
                                                    className="w-4 h-4 text-blue-600 rounded"
                                                />
                                            </td>
                                            <td className="p-2">
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => setEditingIndex(editingIndex === index ? null : index)}
                                                        className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                                                    >
                                                        <FiEdit2 size={14} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => deleteVariant(index)}
                                                        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                                                    >
                                                        <FiTrash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Summary */}
                        <div className="bg-gray-50 p-3 text-sm text-gray-600 flex justify-between">
                            <span>Tổng: {variants.length} biến thể</span>
                            <span className="font-medium">
                                Tổng tồn kho: {variants.reduce((sum, v) => sum + (v.stock || 0), 0)}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VariantManager;
