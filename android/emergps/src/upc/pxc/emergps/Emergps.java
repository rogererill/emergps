package upc.pxc.emergps;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

import android.app.Activity;
import android.os.Bundle;
import android.os.Handler;
import android.widget.*;
import android.view.*;
import android.view.View.OnClickListener;
import android.content.Intent;
import android.util.Log;

public class Emergps extends Activity implements OnClickListener{
    /** Called when the activity is first created. */
	EditText tu, tp;
	Button login;
	
	//private Handler guiThread;
	private ExecutorService autentThread;
	private Runnable updateTask;
	private Future autentPending;
	
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.autent);
        
        initThreading();
        findViews();
        

       
    }
    
    private void initThreading(){
    	final String TAG = "initThreading";
    	
    	//this.guiThread = new Handler();
    	this.autentThread = Executors.newSingleThreadExecutor();
    	
    	this.updateTask = new Runnable(){
    		public void run(){
    			if(autentPending != null)	autentPending.cancel(true);
    			
    			if(tu.getText().toString().length() == 0 || tu.getText().toString().length() == 0){
    				
    				Log.d(TAG, "ERROR: user o pass buits");
    				// ERROR!
    			} else {
    				// RODETA MACA
    				
    				try{
    					AutentificationTask autentT = new AutentificationTask(Emergps.this, tu.getText().toString(), tp.getText().toString());
    					autentPending = autentThread.submit(autentT);
    					
    				} catch(Exception e){
    					// ERROR!
    					Log.d(TAG, "ERROR: no s'ha pogut conectar");
    				}
    			}
    			
    		}
    		
    	};
    	
    	
    }
    
    public void resultAutent(boolean b){
    	if(!b){
    		// ERROR
    		Log.d("FINAL", "REFUSAT!");
    	} else {
    		// ENTRAR! :D
    		Log.d("FINAL", "ACCEPTAT!");
    	}
    	
    }
    
    private void findViews(){
        tu = (EditText) findViewById(R.id.text_user);
        tp = (EditText) findViewById(R.id.text_pass);
        login = (Button) findViewById(R.id.login_button);
        login.setOnClickListener(this);
    }
    
    public void onClick(View v){
    	String stu = tu.getText().toString();
    	String stp = tp.getText().toString();
    	final String TAG = "Autenticació";
    	
    	updateTask.run();
    	/*
    	if(/*userOk(stu, stp)true){
    		Log.d(TAG, "OK!");
			Intent i = new Intent(this, Menu.class);
			startActivity(i);
			finish();
			
    	} else {
    		Log.d(TAG, "OUT!");
    		Intent i = new Intent(this, Error.class);
    		
    		String err = getResources().getString(R.string.error_login);
    		i.putExtra("ERROR", err);
    		startActivity(i);
    	}
    	*/
    }
    
    private boolean userOk(String login, String pass){		// Implementar comunicació
    	if(login.equals("a") && pass.equals("a"))	return true;
    	return false;
    }
    
    
    
    
    
    
    
    
    
    
    
    
}