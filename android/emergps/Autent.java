package upc.pxc.emergps;

import android.app.Activity;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.Bundle;
import android.os.IBinder;
import android.util.Log;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.EditText;

public class Autent extends Activity implements OnClickListener{
	final String TAG = "AUTENT";
	EditText tu, tp;
	Button login;
	
	private ServiceConnection conn;
	private IComService myService;
	
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.autent);
        
        
        initService();
        
        findViews();
       
    }

    private void findViews(){
        tu = (EditText) findViewById(R.id.text_user);
        tp = (EditText) findViewById(R.id.text_pass);
        login = (Button) findViewById(R.id.login_button);
        login.setOnClickListener(this);
    }

	private void initService() {
		
        conn = new ServiceConnection() {

			@Override
			public void onServiceConnected(ComponentName name, IBinder service) {
				// TODO Auto-generated method stub
				myService = (IComService) service;
		        myService.setId(10);
				
			}

			@Override
			public void onServiceDisconnected(ComponentName name) {
				// TODO Auto-generated method stub
				
			}

			
        };
		
        bindService(new Intent(Autent.this ,ComService.class), conn, Context.BIND_AUTO_CREATE);
        
	}

    public void onClick(View v){
    	String stu = tu.getText().toString();
    	String stp = tp.getText().toString();
    	
    }
	
}
