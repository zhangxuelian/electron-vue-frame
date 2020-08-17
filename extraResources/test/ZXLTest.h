#ifndef _ZXLTEST_SDK_H_
#define _ZXLTEST_SDK_H_

#if defined(_WIN32) || defined(_WIN64)

#ifdef ZXLTEST_EXPORTS

#define ZXL_API extern "C" __declspec(dllexport) 
#define ZXL_API_CALLBACK __stdcall

#else

#define ZXL_API extern "C" __declspec(dllimport)
#define ZXL_API_CALLBACK __stdcall

#endif

#else

#define ZXL_API extern "C"
#define ZXL_API_CALLBACK 

#endif

/** 
* @brief	SDK��ʼ��������һ�Σ�  
* @param	[in]nCount			
* @return	����nCountֵ���봫�����nCount��Ӧ
*/
ZXL_API int ZXLSDK_Init(int nCount);

#endif