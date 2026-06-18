import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{fontFamily:'system-ui,sans-serif',height:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',textAlign:'center',padding:20}}>
      <p style={{fontSize:80,fontWeight:200,margin:0,color:'#999'}}>404</p>
      <p style={{fontSize:16,color:'#666',margin:'16px 0'}}>页面未找到</p>
      <Link href="/" style={{color:'#171717',fontSize:14}}>← 返回首页</Link>
    </div>
  );
}
