package upc.pxc.emergps;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Point;
import android.util.Log;
import android.widget.Toast;

import com.google.android.maps.GeoPoint;
import com.google.android.maps.MapView;
import com.google.android.maps.Overlay;
import com.google.android.maps.Projection;

public class OverlayMapa extends Overlay {
	
	static final int VAL_POS = 0;
	static final int VAL_INCID = 1;
	static final int VAL_POL = 2;
	static final int VAL_BOMB = 3;
	static final int VAL_AMB = 4;
	
	private Double latitud;
	private Double longitud;
	private int type;
	
	OverlayMapa(int type, Double posx, Double posy){
		this.longitud  =  posx;
		this.latitud = posy;
		this.type = type;
	}
	
	
	@Override
	public void draw(Canvas canvas, MapView mapView, boolean shadow) 
	{
		Projection projection = mapView.getProjection();
		GeoPoint geoPoint = 
			new GeoPoint((int)Math.round(latitud*1000000), (int)Math.round(longitud*1000000));
		
		if (shadow == false) 
		{
			Point centro = new Point();
			projection.toPixels(geoPoint, centro);

			//Definimos el pincel de dibujo
			Paint p = new Paint();
			p.setColor(Color.BLUE);
			
			//Marca Ejemplo 1: Círculo y Texto
			//canvas.drawCircle(centro.x, centro.y, 5, p);
			//canvas.drawText("Sevilla", centro.x+10, centro.y+5, p);
			
			//Log.d("OVERLAY", Integer.toString(type) + ": " + Double.toString(longitud) + " - " + Double.toString(latitud));
			
			//Marca Ejemplo 2: Bitmap
			Bitmap bm;
			switch(type){
			case VAL_POS:
				bm = BitmapFactory.decodeResource(mapView.getResources(), R.drawable.pos);
				break;
			case VAL_INCID:
				bm = BitmapFactory.decodeResource(mapView.getResources(), R.drawable.incidencia);
				break;
			case VAL_POL:
				bm = BitmapFactory.decodeResource(mapView.getResources(), R.drawable.policia);
				break;
			case VAL_BOMB:
				bm = BitmapFactory.decodeResource(mapView.getResources(), R.drawable.bomber);
				break;
			default:	// VAL_AMB
				bm = BitmapFactory.decodeResource(mapView.getResources(), R.drawable.ambulancia);
				
			}

			
			canvas.drawBitmap(bm, centro.x - bm.getWidth()/2, centro.y - bm.getHeight(), p);
		}
	}
	
	@Override
	public boolean onTap(GeoPoint point, MapView mapView) 
	{
		Context contexto = mapView.getContext();
		String msg = "Lon: " + point.getLongitudeE6()/1E6 + " - " + 
		             "Lat: " + point.getLatitudeE6()/1E6;
		
		Toast toast = Toast.makeText(contexto, msg, Toast.LENGTH_SHORT);
		toast.show();
		
		return true;
	}
}
