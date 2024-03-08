interface GitTreeObj {
	path: string;
	mode: string;
	type: string;
	sha: string;
	size: number;
	url: string;
}

interface GitTreeExtracted {
	fileName: string;
	fileUrl: string;
	path: string[];
}