package upc.pxc.emergps;

import android.app.Activity;
import android.app.Service;
import android.content.Intent;
import android.os.Binder;
import android.os.IBinder;
import android.util.Log;




public class ComService extends Service {
	final String TAG = "ComService";
	int id;
	private MyServiceBinder myServiceBinder;

	   @Override
	   public IBinder onBind(Intent intent) {
		   Log.d(TAG, "onBind");
		   return myServiceBinder;
	   }

	   @Override
	   public void onCreate() {
	      //code to execute when the service is first created
		   id = -1;
		   myServiceBinder = new MyServiceBinder();
		   Log.d(TAG, "onCreate");
	   }

	   @Override
	   public void onDestroy() {
	      //code to execute when the service is shutting down
		   Log.d(TAG, "onDestroy");
	   }

	   @Override
	   public void onStart(Intent intent, int startid) {
	      //code to execute when the service is starting up
		   Log.d(TAG, "onStart");
	   }
	
		public class MyServiceBinder extends Binder implements IComService{

			public int getId() {
				return id;
			}
			public void setId(int n){
				id = n;
			}
			
		}
	   
	   
}