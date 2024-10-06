import { useEffect, useRef } from 'react';

export default function HTMLRenderer({ htmlCode }: { htmlCode: string }) {
	const iframeRef = useRef<HTMLIFrameElement>(null);

	useEffect(() => {
		if (iframeRef.current) {
			const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
			if (doc) {
				doc.open();
				doc.write(htmlCode);
				doc.close();
			}
		}
	}, [htmlCode]);

	return (
		<div className="h-[80vh] w-[80vw]">
			<iframe
				ref={iframeRef}
				className="h-full w-full"
			/>
		</div>
	);
}