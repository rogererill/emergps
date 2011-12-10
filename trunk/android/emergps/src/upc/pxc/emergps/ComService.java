package upc.pxc.emergps;

import java.io.IOException;

import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.BasicResponseHandler;
import org.apache.http.impl.client.DefaultHttpClient;

import android.app.Activity;
import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.net.Uri;
import android.os.Binder;
import android.os.Bundle;
import android.os.Handler;
import android.os.IBinder;
import android.util.Log;
import android.widget.Toast;




public class ComService extends Service{
	String URL = "http://roger90.no-ip.org/HelloWorld/resources/emergps";  
	//String URL = "http://mihizawi.redirectme.net/HelloWorld/resources/emergps";  
		final String TAG = "ComService";
		private int id = -1;
		private int nIncid = -1;
		private boolean incid = false;		
		 private final IBinder mBinder = new LocalBinder();
		 private Handler handler = new Handler();
		 public static final String COUNTERKEY = "countervalue";
		 public static final String POS_FILTER = "upc.pxc.emergps.filter.pos";
		 public static final String DADES_FILTER = "upc.pxc.emergps.filter.dades";
		 public static final String DADES_EXTRA = "dades"; 
		 private static final String ACK = "true";
		 private static final int TIME_ENV_POS = 5000;
		 private static final int TIME_DADES_INC = 5000;
		private static final int NOTIF_ALERTA_ID = 0;
		 private String dades = "";
		 
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
	            //final Runnable r = this;
	            startLocalizacion();
	            
	            Thread env_pos = new Thread() {		// THREAD ENV POS
	            	public void run(){
	            		while(true){
	            			if(id != -1){
	            				broadCastPos();
			            		if(enviaPos()){
			            			if(!incid)	notificar();
		            				incid = true;
		            			}
	            			}
		            		try {
								Thread.sleep(TIME_ENV_POS);
							} catch (InterruptedException e) {
								e.printStackTrace();
							}
	            		}
	            	}
	            };
	            env_pos.start();
	            
	            Thread dades_inc = new Thread(){
	            	public void run(){
	            		while(true){
	            			if(incid){
	            				dades = actIncid();
	            				Log.d("THREAD", dades);
	            				//handler.post(r);
	            				broadCastDades();
	            			}
		            		try {
								Thread.sleep(TIME_DADES_INC);
							} catch (InterruptedException e) {
								e.printStackTrace();
							}
	            		}
	            		
	            	}
	            };
	            dades_inc.start();
	      }	      
	      
	      
	      private void notificar(){
	    	  
	    	//Obtenemos una referencia al servicio de notificaciones
	    	  String ns = Context.NOTIFICATION_SERVICE;
	    	  NotificationManager notManager =
	    	      (NotificationManager) getSystemService(ns);
	    	  
	    	//Configuramos la notificación
	    	  int icono = android.R.drawable.stat_sys_warning;
	    	  CharSequence textoEstado = "Incidència!";
	    	  long hora = System.currentTimeMillis();
	    	   
	    	  Notification notif = new Notification(icono, textoEstado, hora);
	    	  
	    	//Configuramos el Intent
	    	  Context contexto = getApplicationContext();
	    	  CharSequence titulo = "Nova incidència";
	    	  CharSequence descripcion = "Nova incidència";
	    	   
	    	  Intent notIntent = new Intent(contexto,Incidence.class);
	    	  notIntent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
	    	  
	    	  PendingIntent contIntent = PendingIntent.getActivity(contexto, 0, notIntent, 0);

	    	   
	    	  notif.setLatestEventInfo(contexto, titulo, descripcion, contIntent);
	    	  
	    	//AutoCancel: cuando se pulsa la notificaión ésta desaparece
	    	  notif.flags |= Notification.FLAG_AUTO_CANCEL;
	    	   
	    	  //Añadir sonido, vibración y luces
	    	  //notif.defaults |= Notification.DEFAULT_SOUND;
	    	  notif.defaults |= Notification.DEFAULT_VIBRATE;
	    	  //notif.defaults |= Notification.DEFAULT_LIGHTS;
	    	  
	    	  
	    	//Enviar notificación
	    	  notManager.notify(NOTIF_ALERTA_ID, notif);
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
	      
	      public Location getLoc(){
	    	  return loc;
	      }

	      
	      public int getId(){
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
	    		        //Log.i("autent", result);  
	    		
	    		       
	    		  
	    		  
			} catch (Exception e) {
				e.printStackTrace();
			}
	    	  

	    	  int aux = Integer.parseInt(result);
	    	  if(aux < 10000 || aux >= 40000)	return false;
	    	  id = Integer.parseInt(result);
	    	  return true;
	      }
	      
	      
	      LocationManager locManager;
	      LocationListener locListener;
	      Location loc;
	      private void startLocalizacion()
	      {
	          //Obtenemos una referencia al LocationManager
	          locManager = (LocationManager)getSystemService(Context.LOCATION_SERVICE);
	       
	          //Obtenemos la última posición conocida
	          loc = locManager.getLastKnownLocation(LocationManager.GPS_PROVIDER);

	          if(loc == null){
	        	  loc = new Location("AUX_PROVIDER");
    	          loc.setLatitude(41.4164d);	// POSICIO DE LES COTXERES
    	          loc.setLongitude(2.1345d);
	          }
	          
	          //Nos registramos para recibir actualizaciones de la posición
	          locListener = new LocationListener() {
	        	  @Override
	              public void onLocationChanged(Location location) {
	                  loc = location;
	              }

				@Override
				public void onProviderDisabled(String provider) {

					
				}

				@Override
				public void onProviderEnabled(String provider) {

					
				}

				
				@Override
				public void onStatusChanged(String provider, int status,
						Bundle extras) {

					
				}
	       
	              //Resto de métodos del listener
	              //...
	          };
	       
	          locManager.requestLocationUpdates(
	              LocationManager.GPS_PROVIDER, 30000, 5000, locListener);
	      }
	      
	      public boolean enviaPos(){
		  		String result = "0";
		    	  try {
		    		  Double posX, posY;
		    		  if(loc == null || loc.getLongitude() < 2d || loc.getLongitude() > 2.3d || loc.getLatitude() < 40.8d || loc.getLatitude() > 42.7d ){
		    	          loc.setLatitude(41.4164d);	// POSICIO DE LES COTXERES
		    	          loc.setLongitude(2.1345d);
		    		  }
		    		  
		    		  		posX = loc.getLongitude();
		    		  		posY = loc.getLatitude(); 
		    		  
		    		 
		    		        HttpClient httpclient = new DefaultHttpClient();  
		    		       
		    		        //Log.d(TAG, "long: "+posX+" - lat: "+posY);
		    		        
		    		        HttpGet request = new HttpGet(URL+"/env_pos");
		    		        request.addHeader("id", Integer.toString(id));
		    		        request.addHeader("posx", Double.toString(posX));
		    				request.addHeader("posy", Double.toString(posY));
		    				
		    		        ResponseHandler<String> handler = new BasicResponseHandler();  
		    		        try {  
		    		        
		    		            result = httpclient.execute(request, handler);  
		    		        } catch (ClientProtocolException e) {  
		    		            e.printStackTrace();  
		    		        } catch (IOException e) {  
		    		            e.printStackTrace();  
		    		        }  
		    		        httpclient.getConnectionManager().shutdown();  
		    		        //Log.i("enviaPos", result);  

				} catch (Exception e) {
					e.printStackTrace();
				}
		    	 boolean ret = false;
		    	 ret = result.equals("1");
	    	  return ret;
	      }
	      
	      public String actIncid(){
		  		String result = "0";
		    	  try {
		    		  
		    		        HttpClient httpclient = new DefaultHttpClient();  
		    		       
		    		        HttpGet request = new HttpGet(URL+"/inc_act");
		    		        

		    		        request.addHeader("id", Integer.toString(id));
		    				
		    		        ResponseHandler<String> handler = new BasicResponseHandler();  
		    		        try {  
		    		        	
		    		            result = httpclient.execute(request, handler);  
		    		        } catch (ClientProtocolException e) {  
		    		            e.printStackTrace();  
		    		        } catch (IOException e) {  
		    		            e.printStackTrace();  
		    		        }  
		    		        httpclient.getConnectionManager().shutdown();  
		    		        Log.i("actIncid", result);  

				} catch (Exception e) {
					e.printStackTrace();
					Log.i("actIncid(ERROR)", result);  
				}
	    	  return result;
	      }
	      
	     
	      
	      public boolean novaIncid(double posX, double posY, String desc){
	    	  boolean res = false;
	    	  String result = "";
	    	  try {
	    		  
  		        HttpClient httpclient = new DefaultHttpClient();  
  		       
  		        HttpGet request = new HttpGet(URL+"/new_inc");
  		        //request.addHeader("id", Integer.toString(id));
  		        request.addHeader("posx", Double.toString(posX));
  		        request.addHeader("posy", Double.toString(posY));
  		        request.addHeader("comentari", desc);
  		        ResponseHandler<String> handler = new BasicResponseHandler();  
  		        try {  
  		        	
  		            result = httpclient.execute(request, handler);  
  		        } catch (ClientProtocolException e) {  
  		            e.printStackTrace();  
  		        } catch (IOException e) {  
  		            e.printStackTrace();  
  		        }  
  		        httpclient.getConnectionManager().shutdown();  
  		        //Log.i("novaIncid", result);  

				} catch (Exception e) {
					e.printStackTrace();
				}
	    	  res = result.equals(ACK);
	    	  return res;
	      }
	      
	      public boolean fiIncid(){
	    	  boolean res = false;
	    	  String result = "";
	    	  try {
	    		  
  		        HttpClient httpclient = new DefaultHttpClient();  
  		       
  		        HttpGet request = new HttpGet(URL+"/fin_inc");
  		        request.addHeader("id", Integer.toString(id));
  		        ResponseHandler<String> handler = new BasicResponseHandler();  
  
  		        	
  		         result = httpclient.execute(request, handler);  

  		        httpclient.getConnectionManager().shutdown();  
  		        //Log.i("fiIncid", result);  

				} catch (Exception e) {
					e.printStackTrace();
					//Log.i("fiIncid", "Error");
				}
	    	  res = result.equals(ACK);
	    	  if(res){
	    		  incid = false;
	    		  nIncid = -1;
	    	  }
	    	  return res;
	      }
	      
	     
	      
	      public boolean logout(){
	    	  boolean res = false;
	    	  String result = "";
	    	  try {
	    		  
  		        HttpClient httpclient = new DefaultHttpClient();  
  		       
  		        HttpGet request = new HttpGet(URL+"/logout");
  		        request.addHeader("id", Integer.toString(id));
  		        ResponseHandler<String> handler = new BasicResponseHandler();  

  		        
  		       
  		        result = httpclient.execute(request, handler);  

  		        httpclient.getConnectionManager().shutdown();  

				} catch (Exception e) {
					e.printStackTrace();
				}
	    	  res = result.equals(ACK);
	    	  if(res){	//TODO
	    		  incid = false;
	    		  id = -1;
	    		  nIncid = -1;
	    	  }
	    	  return res;
	      }
	      
	     
	     
		private void broadCastPos(){
			Intent intent = new Intent();
			intent.setAction(POS_FILTER); //Define intent-filter
			sendBroadcast(intent);
		}
		
		private void broadCastDades(){
			if(dades.equals("-1") || dades.equals("0")){
				incid = false;
				nIncid = -1;
				Log.d("BroadCastDades", "Error del servidor");
			} else {
				Intent intent = new Intent();
				intent.putExtra(DADES_EXTRA, dades);
				intent.setAction(DADES_FILTER); //Define intent-filter
				sendBroadcast(intent);
	
			}
		}
	}