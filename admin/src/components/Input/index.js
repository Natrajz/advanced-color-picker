import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import ColorPicker, { useColorPicker } from 'react-best-gradient-color-picker';
import styled from 'styled-components';
import { Box } from '@strapi/design-system/Box';
import { Button } from '@strapi/design-system/Button';
import { Field, FieldLabel, FieldHint, FieldError } from '@strapi/design-system/Field';
import { Flex } from '@strapi/design-system/Flex';
import { Typography } from '@strapi/design-system/Typography';
import { Popover } from '@strapi/design-system/Popover';
import { CarretDown } from '@strapi/icons';
import getTrad from '../../utils/getTrad';

const ColorPreview = styled.div.attrs((props) => ({
    style: {
      background: props.color, // Inline style for dynamic background color
    },
  }))`
    border-radius: 5px;
    width: 50px;
    height: 30px;
    margin-right: 10px;
    border: 1px solid rgba(0, 0, 0, 0.1);
  `;

const ColorPickerToggle = styled(Button)`
  width: 100%;
  padding: 0;
  & > span {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    text-align: left;
    & > div {
        overflow: hidden;
        width: 100%;
    }
  }

  svg {
    width: ${({ theme }) => theme.spaces[2]};
    height: ${({ theme }) => theme.spaces[2]};
    position: absolute;
    right: 10px;
  }

  svg > path {
    fill: ${({ theme }) => theme.colors.neutral500};
  }
`;

const StyledColorPicker = styled(ColorPicker)`
  .gradient-controls {
    margin-top: 8px;
  }
  .gradient-controls button {
    background: #f0f0f0;
    border: 1px solid #ddd;
    padding: 4px 8px;
    border-radius: 4px;
    margin-right: 8px;
    cursor: pointer;
    &.active {
      background: #4945ff;
      color: white;
      border-color: #4945ff;
    }
  }
`;

const rgbaToHex = (rgba) => {
    // Extract the numbers from rgba format
    const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (!match) return rgba; // Return original if not rgba format

    const r = parseInt(match[1]);
    const g = parseInt(match[2]);
    const b = parseInt(match[3]);
    const a = match[4] ? parseFloat(match[4]) : 1;

    // Convert to hex
    const toHex = (n) => {
      const hex = Math.round(n).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    // If alpha is 1, return standard hex
    if (a === 1) {
      return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }
    // If alpha is not 1, include it in the hex
    return `#${toHex(r)}${toHex(g)}${toHex(b)}${toHex(Math.round(a * 255))}`;
  };

const ColorPickerField = React.forwardRef(({
    hint,
    disabled = false,
    labelAction,
    label,
    name,
    required = false,
    onChange,
    value: initialValue,
    error
}) => {
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [value, setValue] = useState(initialValue || '#000000');
    const { isGradient } = useColorPicker(value, setValue);

    const buttonRef = React.useRef();
    const { formatMessage } = useIntl();

    // Clean the color value by removing semicolons and extra whitespace
    const cleanColorValue = (colorValue) => {
        return colorValue.replace(/;/g, '').trim();
    };

    // Update both local state and parent
    /**
     * Makes the color value available to the document for database update
     * @param {string} newValue - in hex format
    */
    const updateValue = (newValue) => {
        const cleanedValue = cleanColorValue(newValue);
        setValue(cleanedValue);
        onChange({ target: { name, value: cleanedValue } });
    };

    /**
   * Handle color change from the the color picker
   * @param {string} newValue - in RGBA format
   */
    const handleColorChange = (newValue) => {
        const match = newValue.match(/^rgb\((\d{1,3},\s?){2}\d{1,3}\)$/i);
        const hexValue = match ? newValue.replace(/rgba?\([^)]+\)/g, (match) => rgbaToHex(match)) : newValue;
        updateValue(hexValue);
    };

    const handleInputChange = (e) => {
        updateValue(e.target.value);
    };

    React.useEffect(() => {
        if (initialValue !== value) {
            setValue(cleanColorValue(initialValue || '#000000'));
        }
    }, [initialValue]);

    const colorPickerProps = {
        value: value,
        onChange: handleColorChange,
        width: 260,
        height: 100,
        hideControls: false,
        hideInputs: true,
        hidePresets: true,
        hideEyeDrop: true,
        hideAdvancedSliders: false,
        hideColorGuide: false,
        hideGradientType: false,
        hideGradientAngle: false,
        hideGradientStop: false,
        hideGradientControls: false,
        valueFormat:"hex",
        setValueFormat:"hex"
    };

    return (
        <Field
            name={name}
            id={name}
            error={error}
            hint={hint}
            required={required}
        >
            <Flex direction="column" alignItems="stretch" gap={1}>
                <FieldLabel action={labelAction}>{label}</FieldLabel>
                <ColorPickerToggle
                    ref={buttonRef}
                    aria-label={formatMessage({
                        id: getTrad('color-picker.toggle.aria-label'),
                        defaultMessage: 'Color picker toggle',
                    })}
                    disabled={disabled}
                    variant="secondary"
                    onClick={() => setShowColorPicker(s => !s)}
                >
                    <Flex>
                        <ColorPreview color={value} />
                        <Typography
                            style={{
                                textTransform: 'lowercase', whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis',
                                width: 'calc(100% - 100px)',
                                overflow: 'hidden'
                            }}
                            textColor={value ? undefined : 'neutral600'}
                            variant="pi"
                        >
                            {value}
                        </Typography>
                    </Flex>
                    <CarretDown aria-hidden />
                </ColorPickerToggle>

                {showColorPicker && (
                    <Popover
                        source={buttonRef}
                        spacing={4}
                        onDismiss={() => setShowColorPicker(false)}
                        style={{
                            minHeight: isGradient ? 360 : 290
                        }}
                    >
                        <Box padding={4} >
                            <StyledColorPicker
                                {...colorPickerProps}
                            />
                            <Flex paddingTop={3} justifyContent="flex-start">
                                <Box paddingRight={2}>
                                    <Typography variant="pi" textColor="neutral600" style={{ fontSize: 12, textTransform: 'capitalize', fontWeight: 'bold' }}>
                                        {isGradient ? 'Gradient' : 'Solid'}
                                    </Typography>
                                </Box>
                                <Field>
                                    <input
                                        type="text"
                                        aria-label={formatMessage({
                                            id: getTrad('color-picker.input.aria-label'),
                                            defaultMessage: 'Color picker input',
                                        })}
                                        style={{
                                            width: '200px',
                                            padding: '0.5rem',
                                            border: '1px solid #dcdce4',
                                            borderRadius: '4px',
                                            fontSize: '12px'
                                        }}
                                        value={value}
                                        placeholder={isGradient ? 'linear-gradient(...)' : '#000000'}
                                        onChange={handleInputChange}
                                    />
                                </Field>
                            </Flex>
                        </Box>
                    </Popover>
                )}
                <FieldHint />
                <FieldError />
            </Flex>
        </Field>
    );
});

ColorPickerField.displayName = 'ColorPickerField';

export default ColorPickerField;