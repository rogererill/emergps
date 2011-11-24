package upc.pxc.emergps;

import java.io.IOException;

import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.BasicResponseHandler;
import org.apache.http.impl.client.DefaultHttpClient;

import android.app.Activity;
import android.app.Service;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Binder;
import android.os.Handler;
import android.os.IBinder;
import android.util.Log;
import android.widget.Toast;




public class ComService extends Service implements Runnable{
	String URL = "http://roger90.no-ip.org/HelloWorld/resources/emergps";  
		final String TAG = "ComService";
		private int id = -1;
		 private final IBinder mBinder = new LocalBinder();
		 private Handler handler = new Handler();
		 public static final String COUNTERKEY = "countervalue";
		 public static final String MYOWNACTIONFILTER = "upc.pxc.emergps.intent.filter";

		@Override
		public IBinder onBind(Intent intent) {
			return mBinder; // object of the class that implements Service
									// interface.
		}
		
		@Override
		public boolean onUnbind(Intent intent) {
		    //Log.d(this.getClass().getName(), "UNBIND");
		    return true;
		}
		
		  
	      @Override
	      public void onCreate() {
	            super.onCreate();
	            
	            Thread t = new Thread() {
	            	public void run(){
	            		while(true){
		            		//enviaPos();
	            			
		            		try {
								Thread.sleep(10000);
							} catch (InterruptedException e) {
								// TODO Auto-generated catch block
								e.printStackTrace();
							}
	            		}
	            	}
	            };
	            t.start();
	      }
	      
	      @Override
	      public void onDestroy() {
	            super.onDestroy();
	      }
	      
	      @Override
	      public void onStart(Intent intent, int startId) {
	            super.onCreate();
	      }
	      
	      public class LocalBinder extends Binder {
	          ComService getService() {
	              return ComService.this;
	          }
	      }
	      

	      
	      public int getId(){
	    	  handler.post(this);
	    	  return id;
	      }
	      public void setId(int n){
	    	  this.id = n;
	      }

	      public boolean autent(String user, String pass){
		  		String result = "0";
	    	  try {
	    		 
	    		  
	    		        HttpClient httpclient = new DefaultHttpClient();  
	    		       
	    		        HttpGet request = new HttpGet(URL+"/login");
	    		        
	    		        request.addHeader("user", user);
	    				request.addHeader("pass", pass);
	    				
	    		        ResponseHandler<String> handler = new BasicResponseHandler();  
	    		        try {  
	    		        	
	    		            result = httpclient.execute(request, handler);  
	    		        } catch (ClientProtocolException e) {  
	    		            e.printStackTrace();  
	    		        } catch (IOException e) {  
	    		            e.printStackTrace();  
	    		        }  
	    		        httpclient.getConnectionManager().shutdown();  
	    		        Log.i(TAG, result);  
	    		
	    		        
	    		  
	    		  
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
	    	  id = Integer.parseInt(result);
	    	  return true;
	      }
	      
	      public boolean enviaPos(){
		  		String result = "0";
		    	  try {
		    		  		Float posX = 0.0f, posY = 0.0f;
		    		  
		    		        HttpClient httpclient = new DefaultHttpClient();  
		    		       
		    		        HttpGet request = new HttpGet(URL+"/env_pos");
		    		        request.addHeader("id", Integer.toString(id));
		    		        request.addHeader("posx", Float.toString(posX));
		    				request.addHeader("posy", Float.toString(posY));
		    				
		    		        ResponseHandler<String> handler = new BasicResponseHandler();  
		    		        try {  
		    		        	
		    		            result = httpclient.execute(request, handler);  
		    		        } catch (ClientProtocolException e) {  
		    		            e.printStackTrace();  
		    		        } catch (IOException e) {  
		    		            e.printStackTrace();  
		    		        }  
		    		        httpclient.getConnectionManager().shutdown();  
		    		        Log.i(TAG, result);  

				} catch (Exception e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
		    	 boolean ret = false;
		    	 //ret = result.equals("1");
	    	  return ret;
	      }
	      
		@Override
		public void run() {
			// TODO Auto-generated method stub
			broadCast();
		}
	      
		private void broadCast(){
			Intent intent = new Intent();
			intent.setAction(MYOWNACTIONFILTER); //Define intent-filter
			intent.putExtra("SERVICE", "PROVA");
			sendBroadcast(intent);
			//handler.postDelayed(this, 1*1000);
		}
	}