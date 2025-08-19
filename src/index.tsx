import { createRoot } from 'react-dom/client';
import { StrictMode, useRef, useEffect } from 'react';
import { Article } from 'components/article';
import { ArticleParamsForm } from 'components/article-params-form';
import { defaultArticleState } from './constants/articleProps';
import './styles/index.scss';
import styles from './styles/index.module.scss';

const domNode = document.getElementById('root');
if (!domNode) throw new Error('Root element not found');
const root = createRoot(domNode);

const App = () => {
	const mainRef = useRef<HTMLElement>(null);

	const updateMainStyles = (styles: Record<string, string>) => {
		if (mainRef.current) {
			Object.entries(styles).forEach(([key, value]) => {
				mainRef.current!.style.setProperty(key, value);
			});
		}
	};

	// Устанавливаем начальные стили при монтировании
	useEffect(() => {
		const initialStyles = {
			'--font-family': defaultArticleState.fontFamilyOption.value,
			'--font-size': defaultArticleState.fontSizeOption.value,
			'--font-color': defaultArticleState.fontColor.value,
			'--container-width': defaultArticleState.contentWidth.value,
			'--bg-color': defaultArticleState.backgroundColor.value,
		};
		updateMainStyles(initialStyles);
	}, []);

	return (
		<main
			ref={mainRef}
			className={styles.main}
		>
			<ArticleParamsForm onUpdateStyles={updateMainStyles} />
			<Article />
		</main>
	);
};

root.render(
	<StrictMode>
		<App />
	</StrictMode>
);