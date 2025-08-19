import { useState, useRef, useEffect } from 'react';
import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { Select } from 'src/ui/select';
import { RadioGroup } from 'src/ui/radio-group';
import { Separator } from 'src/ui/separator';
import { Text } from 'src/ui/text';
import {
	fontFamilyOptions,
	type OptionType,
	defaultArticleState,
	type ArticleStateType,
	fontSizeOptions,
	fontColors,
	backgroundColors,
	contentWidthArr,
} from 'src/constants/articleProps';
import clsx from 'clsx';
import styles from './ArticleParamsForm.module.scss';

type CssVariables = {
	'--font-family': string;
	'--font-size': string;
	'--font-color': string;
	'--container-width': string;
	'--bg-color': string;
};

type ArticleParamsFormProps = {
	onUpdateStyles: (styles: CssVariables) => void;
};

export const ArticleParamsForm = ({ onUpdateStyles }: ArticleParamsFormProps) => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [formData, setFormData] = useState<ArticleStateType>(defaultArticleState);
	const formRef = useRef<HTMLFormElement>(null);

	// Функция для получения CSS переменных из состояния формы
	const getCssStyles = (data: ArticleStateType): CssVariables => ({
		'--font-family': data.fontFamilyOption.value,
		'--font-size': data.fontSizeOption.value,
		'--font-color': data.fontColor.value,
		'--container-width': data.contentWidth.value,
		'--bg-color': data.backgroundColor.value,
	});

	// Обработчик открытия/закрытия сайдбара
	const toggleSidebar = () => {
		setIsMenuOpen((prev) => !prev);
	};

	// Закрытие сайдбара при клике вне его области
	useEffect(() => {
		if (!isMenuOpen) return;

		const handleClickOutside = (event: MouseEvent) => {
			if (formRef.current && !formRef.current.contains(event.target as Node)) {
				setIsMenuOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isMenuOpen]);

	// Обработчик изменения полей формы
	const handleChange = (key: keyof ArticleStateType) => (selected: OptionType) => {
		setFormData((prev) => ({ ...prev, [key]: selected }));
	};

	// Обработчик отправки формы (применить)
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		onUpdateStyles(getCssStyles(formData));
		setIsMenuOpen(false);
	};

	// Обработчик сброса формы
	const handleReset = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setFormData(defaultArticleState);
		onUpdateStyles(getCssStyles(defaultArticleState));
	};

	return (
		<>
			<ArrowButton
				isOpen={isMenuOpen}
				onClick={toggleSidebar}
			/>
			<aside
				className={clsx(styles.container, {
					[styles.container_open]: isMenuOpen,
				})}
			>
				<form
					ref={formRef}
					className={styles.form}
					onSubmit={handleSubmit}
					onReset={handleReset}
				>
					<Text as='h2' size={38} weight={800} uppercase>
						Задайте параметры
					</Text>

					<Select
						title='Шрифт'
						selected={formData.fontFamilyOption}
						onChange={handleChange('fontFamilyOption')}
						options={fontFamilyOptions}
					/>

					<RadioGroup
						title='Размер шрифта'
						selected={formData.fontSizeOption}
						name='fontSize'
						onChange={handleChange('fontSizeOption')}
						options={fontSizeOptions}
					/>

					<Select
						title='Цвет шрифта'
						selected={formData.fontColor}
						onChange={handleChange('fontColor')}
						options={fontColors}
					/>

					<Separator />

					<Select
						title='Цвет фона'
						selected={formData.backgroundColor}
						onChange={handleChange('backgroundColor')}
						options={backgroundColors}
					/>

					<Select
						title='Ширина контента'
						selected={formData.contentWidth}
						onChange={handleChange('contentWidth')}
						options={contentWidthArr}
					/>

					<div className={styles.bottomContainer}>
						<Button
							title='Сбросить'
							htmlType='reset'
							type='clear'
						/>
						<Button
							title='Применить'
							htmlType='submit'
							type='apply'
						/>
					</div>
				</form>
			</aside>
		</>
	);
};